import { Response, NextFunction } from 'express';
import { SkillsService } from './skills.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class SkillsController {
  public static async getSkillsWorkspace(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const data = await SkillsService.getSkillsWorkspaceData(userId);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateSkillProgress(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { skillName } = req.params;
      const { status, progress } = req.body;

      const updated = await SkillsService.updateSkillProgress(
        userId,
        decodeURIComponent(String(skillName)),
        status || 'LEARNING',
        Number(progress || 0)
      );

      res.status(200).json({
        success: true,
        data: updated,
        message: 'Skill progress successfully updated.',
      });
    } catch (err) {
      next(err);
    }
  }
}