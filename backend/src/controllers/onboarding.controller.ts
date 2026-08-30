import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { db } from "../config/database";
import { sendSuccess, sendError } from "../utils/response";
import { CareerStage } from "../types/auth.types";

export class OnboardingController {
  public static async setCareerType(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, "Unauthorized", 401, "UNAUTHORIZED");
        return;
      }

      const { careerType } = req.body;

      if (!careerType || !["FRESHER", "PROFESSIONAL", "CAREER_CHANGER", "STUDENT"].includes(careerType)) {
        sendError(res, "Valid careerType (FRESHER or PROFESSIONAL) is required.", 400, "VALIDATION_ERROR");
        return;
      }

      const updated = await db.updateUser(req.user.userId, {
        careerType: careerType as CareerStage,
        careerStage: careerType as CareerStage,
        hasCompletedOnboarding: false,
        onboardingStep: 1,
      });

      sendSuccess(res, {
        user: updated,
        careerType,
        nextRoute: careerType === "FRESHER" ? "/onboarding/fresher" : "/onboarding/professional",
      }, 200, { message: "Career type updated" });
    } catch (error) {
      next(error);
    }
  }

  public static async resetOnboarding(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, "Unauthorized", 401, "UNAUTHORIZED");
        return;
      }

      const { newCareerType } = req.body;
      const updated = await db.resetUserOnboarding(req.user.userId, newCareerType as CareerStage);

      sendSuccess(res, {
        user: updated,
        message: "Onboarding reset. You can now retake the assessment.",
      });
    } catch (error) {
      next(error);
    }
  }
}
