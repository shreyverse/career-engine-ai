import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { CareerAnalysisService } from '../ai/careerAnalysis.service';
import { sendSuccess, sendError } from '../utils/response';

export class CareerAnalysisController {
  public static async generateAnalysis(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
        return;
      }

      const analysisRecord = await CareerAnalysisService.generateAnalysisForUser(req.user.userId, false);

      sendSuccess(
        res,
        {
          analysis: analysisRecord.analysisData,
          metadata: {
            id: analysisRecord.id,
            careerType: analysisRecord.careerType,
            targetRole: analysisRecord.targetRole,
            model: analysisRecord.model,
            version: analysisRecord.version,
            createdAt: analysisRecord.createdAt,
            updatedAt: analysisRecord.updatedAt,
          },
        },
        200,
        { message: 'Career intelligence analysis generated successfully' }
      );
    } catch (error) {
      next(error);
    }
  }

  public static async getLatestAnalysis(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
        return;
      }

      const analysisRecord = await CareerAnalysisService.getLatestAnalysis(req.user.userId);

      if (!analysisRecord) {
        sendSuccess(res, { analysis: null });
        return;
      }

      sendSuccess(res, {
        analysis: analysisRecord.analysisData,
        metadata: {
          id: analysisRecord.id,
          careerType: analysisRecord.careerType,
          targetRole: analysisRecord.targetRole,
          model: analysisRecord.model,
          version: analysisRecord.version,
          createdAt: analysisRecord.createdAt,
          updatedAt: analysisRecord.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async regenerateAnalysis(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
        return;
      }

      const analysisRecord = await CareerAnalysisService.generateAnalysisForUser(req.user.userId, true);

      sendSuccess(
        res,
        {
          analysis: analysisRecord.analysisData,
          metadata: {
            id: analysisRecord.id,
            careerType: analysisRecord.careerType,
            targetRole: analysisRecord.targetRole,
            model: analysisRecord.model,
            version: analysisRecord.version,
            createdAt: analysisRecord.createdAt,
            updatedAt: analysisRecord.updatedAt,
          },
        },
        200,
        { message: 'Career intelligence analysis regenerated successfully' }
      );
    } catch (error) {
      next(error);
    }
  }
}
