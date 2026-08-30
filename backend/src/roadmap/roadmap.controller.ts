import { Request, Response, NextFunction } from 'express';
import { RoadmapService } from './roadmap.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class RoadmapController {
  public static async getRoadmap(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      let data = await RoadmapService.getLatestRoadmap(userId);
      if (!data) {
        try {
          data = await RoadmapService.generateRoadmapForUser(userId, false);
        } catch (genErr: any) {
          res.status(200).json({
            success: true,
            data: null,
            message: 'No roadmap generated yet. Complete onboarding and analysis first.',
          });
          return;
        }
      }

      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async generateRoadmap(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const data = await RoadmapService.generateRoadmapForUser(userId, false);
      res.status(200).json({
        success: true,
        data,
        message: 'Personalized career roadmap generated successfully.',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async regenerateRoadmap(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const data = await RoadmapService.generateRoadmapForUser(userId, true);
      res.status(200).json({
        success: true,
        data,
        message: 'Roadmap successfully regenerated with updated version.',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { taskId } = req.params;
      const { completed } = req.body;

      const data = await RoadmapService.updateTaskProgress(userId, String(taskId), Boolean(completed));
      res.status(200).json({
        success: true,
        data,
        message: 'Task progress updated.',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateProject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { projectId } = req.params;
      const { status } = req.body;

      const data = await RoadmapService.updateProjectProgress(userId, String(projectId), status);
      res.status(200).json({
        success: true,
        data,
        message: 'Project status updated.',
      });
    } catch (err) {
      next(err);
    }
  }
}