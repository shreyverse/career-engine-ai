import crypto from 'crypto';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, StoredUser } from "../config/database";
import { env } from "../config/env";
import { EmailService } from './email.service';
import {
  RegisterDto,
  LoginDto,
  UserDto,
  AuthResponseData,
  JwtPayload,
} from "../types/auth.types";

export class AuthService {
  public static mapUserToDto(user: StoredUser): UserDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      careerStage: user.careerStage,
      careerType: user.careerType,
      isOnboarded: user.hasCompletedOnboarding || user.isOnboarded,
      hasCompletedOnboarding: user.hasCompletedOnboarding || user.isOnboarded,
      onboardingStep: user.onboardingStep || 1,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  public static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.jwtSecret, {
      expiresIn: "7d",
    });
  }

  public static async register(dto: RegisterDto): Promise<AuthResponseData> {
    const existing = await db.findUserByEmail(dto.email);
    if (existing) {
      const err: any = new Error("An account with this email address already exists.");
      err.statusCode = 409;
      err.code = "USER_ALREADY_EXISTS";
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const newUser = await db.createUser({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      avatarUrl: null,
      role: "USER",
      careerStage: dto.careerStage || "FRESHER",
      careerType: dto.careerStage || null,
      isOnboarded: false,
      hasCompletedOnboarding: false,
      onboardingStep: 1,
    });

    const token = this.generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return {
      user: this.mapUserToDto(newUser),
      token,
    };
  }

  public static async login(dto: LoginDto): Promise<AuthResponseData> {
    const user = await db.findUserByEmail(dto.email);
    if (!user) {
      const err: any = new Error("Invalid email or password.");
      err.statusCode = 401;
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      const err: any = new Error("Invalid email or password.");
      err.statusCode = 401;
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: this.mapUserToDto(user),
      token,
    };
  }

  public static async getCurrentUser(userId: string): Promise<{ user: UserDto; profile: any; assessment: any }> {
    const user = await db.findUserById(userId);
    if (!user) {
      const err: any = new Error("User account not found.");
      err.statusCode = 404;
      err.code = "USER_NOT_FOUND";
      throw err;
    }

    const profile = await db.getProfileByUserId(userId);
    const isFresher = (user.careerType || user.careerStage) === "FRESHER";
    const assessment = isFresher
      ? await db.getFresherAssessment(userId)
      : await db.getProfessionalAssessment(userId);

    return {
      user: this.mapUserToDto(user),
      profile,
      assessment,
    };
  }

  public static hashOTP(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  public static async requestPasswordResetOTP(email: string): Promise<{ message: string; email: string; cooldownRemaining?: number }> {
    const normalized = email.toLowerCase().trim();
    const user = await db.findUserByEmail(normalized);

    if (!user) {
      // Generic secure response without leaking email registration
      return {
        message: "If an account exists for this email, a verification code has been sent.",
        email: normalized,
      };
    }

    // Generate cryptographically secure 6-digit OTP
    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = this.hashOTP(rawOtp);

    const result = db.savePasswordResetOTP(normalized, otpHash, 10);
    if (result.cooldownRemaining) {
      const err: any = new Error(`Please wait ${result.cooldownRemaining} seconds before requesting a new OTP.`);
      err.statusCode = 429;
      err.code = "RATE_LIMITED";
      err.cooldownRemaining = result.cooldownRemaining;
      throw err;
    }

    // Send email through Nodemailer Gmail SMTP
    await EmailService.sendPasswordResetOTP(user.email, rawOtp);

    return {
      message: "If an account exists for this email, a verification code has been sent.",
      email: user.email,
    };
  }

  public static async verifyResetOTP(email: string, otp: string): Promise<{ success: boolean; resetToken: string }> {
    const normalized = email.toLowerCase().trim();
    const record = db.getPasswordResetOTP(normalized);

    if (!record) {
      const err: any = new Error("No active password reset request found for this email. Please request a new code.");
      err.statusCode = 400;
      err.code = "NO_ACTIVE_OTP";
      throw err;
    }

    if (Date.now() > record.expiresAt) {
      db.consumePasswordResetOTP(normalized);
      const err: any = new Error("Your OTP has expired. Please request a new one.");
      err.statusCode = 400;
      err.code = "OTP_EXPIRED";
      throw err;
    }

    const inputHash = this.hashOTP(otp.trim());
    if (inputHash !== record.otpHash) {
      const attempts = db.incrementOTPAttempts(normalized);
      if (attempts >= 5) {
        const err: any = new Error("Too many failed attempts. This OTP is now invalid. Please request a new code.");
        err.statusCode = 429;
        err.code = "MAX_ATTEMPTS_EXCEEDED";
        throw err;
      }
      const remaining = 5 - attempts;
      const err: any = new Error(`Invalid verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`);
      err.statusCode = 400;
      err.code = "INVALID_OTP";
      throw err;
    }

    // OTP Verified -> Consume OTP & Issue a temporary 15-minute reset session token
    db.consumePasswordResetOTP(normalized);
    const resetToken = 'rst-' + crypto.randomBytes(24).toString('hex');
    db.saveResetSessionToken(resetToken, normalized, 15);

    return {
      success: true,
      resetToken,
    };
  }

  public static async resetPasswordWithToken(resetToken: string, newPassword: string): Promise<{ message: string }> {
    const verification = db.verifyResetSessionToken(resetToken.trim());
    if (!verification.valid || !verification.email) {
      const err: any = new Error("Invalid or expired reset session. Please request a new verification code.");
      err.statusCode = 400;
      err.code = "INVALID_RESET_TOKEN";
      throw err;
    }

    const user = await db.findUserByEmail(verification.email);
    if (!user) {
      const err: any = new Error("User account not found.");
      err.statusCode = 404;
      err.code = "USER_NOT_FOUND";
      throw err;
    }

    if (!newPassword || newPassword.length < 8) {
      const err: any = new Error("Password must be at least 8 characters long.");
      err.statusCode = 400;
      err.code = "VALIDATION_ERROR";
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    await db.updateUser(user.id, { passwordHash });

    // Invalidate reset session token
    db.consumeResetSessionToken(resetToken.trim());

    return {
      message: "Your Career Engine AI password has been updated successfully. You can now log in.",
    };
  }

  // Aliases for compatibility
  public static async forgotPassword(email: string) {
    return this.requestPasswordResetOTP(email);
  }

  public static async resetPassword(resetToken: string, newPassword: string) {
    return this.resetPasswordWithToken(resetToken, newPassword);
  }
}
