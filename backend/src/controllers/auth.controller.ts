import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/response";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export class AuthController {
    public static async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { credential } = req.body;
      if (!credential) {
        sendError(res, "Google credential token is required.", 400, "VALIDATION_ERROR");
        return;
      }
      const result = await AuthService.googleAuth(credential);
      sendSuccess(res, result, 200, { message: "Authenticated successfully with Google" });
    } catch (error) {
      next(error);
    }
  }

  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, fullName, careerStage } = req.body;

      if (!email || !password || !fullName) {
        sendError(res, "Email, password, and full name are required.", 400, "VALIDATION_ERROR");
        return;
      }

      if (password.length < 8) {
        sendError(res, "Password must be at least 8 characters.", 400, "VALIDATION_ERROR");
        return;
      }

      const result = await AuthService.register({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        careerStage,
      });

      sendSuccess(res, result, 201, { message: "Account created successfully" });
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        sendError(res, "Email and password are required.", 400, "VALIDATION_ERROR");
        return;
      }

      const result = await AuthService.login({
        email: email.trim(),
        password,
      });

      sendSuccess(res, result, 200, { message: "Signed in successfully" });
    } catch (error) {
      next(error);
    }
  }

  public static async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, "Unauthorized", 401, "UNAUTHORIZED");
        return;
      }

      const result = await AuthService.getCurrentUser(req.user.userId);
      sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async logout(_req: Request, res: Response): Promise<void> {
    sendSuccess(res, { message: "Successfully signed out." }, 200);
  }

  public static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        sendError(res, "Email address is required.", 400, "VALIDATION_ERROR");
        return;
      }
      const result = await AuthService.requestPasswordResetOTP(email.trim());
      sendSuccess(res, result, 200, { message: result.message });
    } catch (error) {
      next(error);
    }
  }

  public static async verifyResetOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        sendError(res, "Email and 6-digit verification code are required.", 400, "VALIDATION_ERROR");
        return;
      }
      const result = await AuthService.verifyResetOTP(email.trim(), otp.trim());
      sendSuccess(res, result, 200, { message: "Verification code verified successfully." });
    } catch (error) {
      next(error);
    }
  }

  public static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { resetToken, newPassword } = req.body;
      if (!resetToken || !newPassword) {
        sendError(res, "Reset token and new password are required.", 400, "VALIDATION_ERROR");
        return;
      }
      const result = await AuthService.resetPasswordWithToken(resetToken.trim(), newPassword);
      sendSuccess(res, result, 200, { message: result.message });
    } catch (error) {
      next(error);
    }
  }
}
