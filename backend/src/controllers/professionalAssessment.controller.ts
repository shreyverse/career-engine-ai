import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { db } from "../config/database";
import { sendSuccess, sendError } from "../utils/response";

export class ProfessionalAssessmentController {
  public static async getAssessment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, "Unauthorized", 401, "UNAUTHORIZED");
        return;
      }

      const user = await db.findUserById(req.user.userId);
      if (!user) {
        sendError(res, "User not found", 404, "USER_NOT_FOUND");
        return;
      }

      const assessment = await db.getProfessionalAssessment(req.user.userId);

      sendSuccess(res, {
        careerType: "PROFESSIONAL",
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        onboardingStep: user.onboardingStep,
        assessment: assessment || {
          currentCareer: { currentRole: "", yearsOfExperience: 1, industry: "", company: "", responsibilities: "" },
          skills: { technicalSkills: [], frameworks: [], tools: [], domainSkills: [] },
          careerGoal: { lookingFor: [], primaryMotivation: "" },
          targetRole: { targetRole: "", targetIndustry: "", preferredCompanyType: [] },
          challenges: { careerChallenges: [], challengeDetails: "" },
          resume: { resumeOption: "SKIP" },
          currentStep: 1,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async saveStep(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, "Unauthorized", 401, "UNAUTHORIZED");
        return;
      }

      const { step, data } = req.body;

      if (!step || typeof step !== "number" || step < 1 || step > 6) {
        sendError(res, "Valid step number between 1 and 6 is required.", 400, "VALIDATION_ERROR");
        return;
      }

      const saved = await db.saveProfessionalAssessmentStep(req.user.userId, step, data || {});

      sendSuccess(res, {
        step,
        assessment: saved,
        message: `Step ${step} progress saved successfully`,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async complete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, "Unauthorized", 401, "UNAUTHORIZED");
        return;
      }

      const completed = await db.completeProfessionalAssessment(req.user.userId);
      const user = await db.findUserById(req.user.userId);
      const profile = await db.getProfileByUserId(req.user.userId);

      sendSuccess(res, {
        user,
        profile,
        assessment: completed,
        hasCompletedOnboarding: true,
      }, 200, { message: "Professional career assessment completed successfully" });
    } catch (error) {
      next(error);
    }
  }
}
