import { apiRequest } from "./api";
import { CareerStage, UserRole } from "../types";

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  role: UserRole;
  careerStage: CareerStage;
  careerType?: CareerStage | null;
  isOnboarded: boolean;
  hasCompletedOnboarding: boolean;
  onboardingStep: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CurrentUserResponse {
  user: User;
  profile: any;
  assessment: any;
}

export const authService = {
  async register(data: {
    email: string;
    password: string;
    fullName: string;
    careerStage?: string;
  }): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getMe(): Promise<CurrentUserResponse> {
    return apiRequest<CurrentUserResponse>("/auth/me");
  },

  async logout(): Promise<void> {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors on logout
    }
  },

  async googleLogin(credential: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential }),
    });
  },

  async forgotPassword(email: string): Promise<{ message: string; email: string }> {
    return apiRequest<{ message: string; email: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async verifyResetOTP(email: string, otp: string): Promise<{ success: boolean; resetToken: string }> {
    return apiRequest<{ success: boolean; resetToken: string }>("/auth/verify-reset-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },

  async resetPassword(resetToken: string, newPassword: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ resetToken, newPassword }),
    });
  },
};
