import { Response, NextFunction } from 'express';
import { db } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { sendSuccess, sendError } from '../utils/response';

export class AssessmentController {
  // --- Fresher Assessment ---
  public static async getFresherAssessment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
        return;
      }
      const userId = req.user.userId;
      const user = await db.findUserById(userId);
      if (!user) {
        sendError(res, 'User not found', 404, 'USER_NOT_FOUND');
        return;
      }
      const assessment = (await db.getFresherAssessment(userId)) || {};

      sendSuccess(res, {
        careerType: 'FRESHER',
        hasCompletedOnboarding: Boolean(user.hasCompletedOnboarding || user.isOnboarded),
        onboardingStep: user.onboardingStep || 1,
        assessment,
      }, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async saveFresherStep(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
        return;
      }
      const userId = req.user.userId;
      const { step, data } = req.body;
      const stepNumber = typeof step === 'number' ? step : 1;
      const assessmentData = data || req.body;

      const saved = await db.saveFresherAssessmentStep(userId, stepNumber, assessmentData);

      // Also ensure career profile is updated if targetRole or career goal is provided
      if (assessmentData?.careerGoal?.targetRole) {
        await db.saveCareerProfile(userId, {
          userId,
          careerStage: 'FRESHER',
          targetRole: assessmentData.careerGoal.targetRole,
          targetIndustry: assessmentData.careerGoal.preferredIndustry,
          preferredWorkMode: 'REMOTE',
        });
      }

      sendSuccess(res, {
        step: stepNumber,
        assessment: saved,
      }, 200, { message: 'Fresher assessment step saved successfully' });
    } catch (error) {
      next(error);
    }
  }

  public static async completeFresherAssessment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
        return;
      }
      const userId = req.user.userId;
      const completed = await db.completeFresherAssessment(userId);

      sendSuccess(res, {
        careerType: 'FRESHER',
        hasCompletedOnboarding: true,
        assessment: completed,
        nextRoute: '/dashboard',
      }, 200, { message: 'Fresher assessment completed successfully' });
    } catch (error) {
      next(error);
    }
  }

  // --- Professional Assessment ---
  public static async getProfessionalAssessment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
        return;
      }
      const userId = req.user.userId;
      const user = await db.findUserById(userId);
      if (!user) {
        sendError(res, 'User not found', 404, 'USER_NOT_FOUND');
        return;
      }
      const assessment = (await db.getProfessionalAssessment(userId)) || {};

      sendSuccess(res, {
        careerType: 'PROFESSIONAL',
        hasCompletedOnboarding: Boolean(user.hasCompletedOnboarding || user.isOnboarded),
        onboardingStep: user.onboardingStep || 1,
        assessment,
      }, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async saveProfessionalStep(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
        return;
      }
      const userId = req.user.userId;
      const { step, data } = req.body;
      const stepNumber = typeof step === 'number' ? step : 1;
      const assessmentData = data || req.body;

      const saved = await db.saveProfessionalAssessmentStep(userId, stepNumber, assessmentData);

      // Also ensure career profile is updated if targetRole or aspiration is provided
      if (assessmentData?.careerAspiration?.targetRole || assessmentData?.currentCareer?.currentRole) {
        await db.saveCareerProfile(userId, {
          userId,
          careerStage: 'PROFESSIONAL',
          targetRole: assessmentData.careerAspiration?.targetRole || assessmentData?.currentCareer?.currentRole || 'Senior Fullstack Engineer',
          targetIndustry: assessmentData.currentCareer?.industry,
          preferredWorkMode: 'REMOTE',
        });
      }

      sendSuccess(res, {
        step: stepNumber,
        assessment: saved,
      }, 200, { message: 'Professional assessment step saved successfully' });
    } catch (error) {
      next(error);
    }
  }

  public static async completeProfessionalAssessment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
        return;
      }
      const userId = req.user.userId;
      const completed = await db.completeProfessionalAssessment(userId);

      sendSuccess(res, {
        careerType: 'PROFESSIONAL',
        hasCompletedOnboarding: true,
        assessment: completed,
        nextRoute: '/dashboard',
      }, 200, { message: 'Professional assessment completed successfully' });
    } catch (error) {
      next(error);
    }
  }

  public static async getMyAssessment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
        return;
      }
      const userId = req.user.userId;
      const user = await db.findUserById(userId);
      if (!user) {
        sendError(res, 'User not found', 404, 'USER_NOT_FOUND');
        return;
      }

      const isFresher = (user.careerType || user.careerStage) === 'FRESHER';
      const assessment = isFresher
        ? await db.getFresherAssessment(userId)
        : await db.getProfessionalAssessment(userId);

      sendSuccess(res, {
        careerStage: user.careerStage,
        careerType: user.careerType,
        isOnboarded: user.hasCompletedOnboarding || user.isOnboarded,
        hasCompletedOnboarding: user.hasCompletedOnboarding || user.isOnboarded,
        onboardingStep: user.onboardingStep,
        assessment,
      }, 200);
    } catch (error) {
      next(error);
    }
  }
}
