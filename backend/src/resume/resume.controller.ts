import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ResumeService } from './resume.service';
import {
  CreateResumeSchema,
  UpdateResumeSchema,
  ResumeImprovementSchema,
} from './resume.schema';

export class ResumeController {
  public static async listResumes(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const resumes = await ResumeService.listResumes(userId);
      res.status(200).json({ success: true, data: resumes });
    } catch (err) {
      next(err);
    }
  }

  public static async getResume(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { resumeId } = req.params;
      const resume = await ResumeService.getResumeById(userId, String(resumeId));
      if (!resume) {
        res.status(404).json({ success: false, message: 'Resume not found' });
        return;
      }

      res.status(200).json({ success: true, data: resume });
    } catch (err) {
      next(err);
    }
  }

  public static async createResume(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const parsed = CreateResumeSchema.parse(req.body);
      const created = await ResumeService.createResume(userId, parsed);

      res.status(201).json({
        success: true,
        data: created,
        message: 'Resume created successfully.',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateResume(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { resumeId } = req.params;
      const parsed = UpdateResumeSchema.parse(req.body);
      const updated = await ResumeService.updateResume(userId, String(resumeId), parsed);

      res.status(200).json({
        success: true,
        data: updated,
        message: 'Resume updated successfully.',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteResume(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { resumeId } = req.params;
      await ResumeService.deleteResume(userId, String(resumeId));

      res.status(200).json({
        success: true,
        message: 'Resume deleted successfully.',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async publicAnalyzeResume(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'Please upload a valid PDF or DOCX resume document.' });
        return;
      }

      const { targetRole } = req.body;
      const result = await ResumeService.publicAnalyzeResume(req.file, targetRole);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Resume analyzed successfully.',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async uploadResume(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ success: false, message: 'Please upload a valid PDF or DOCX file.' });
        return;
      }

      const { targetRole } = req.body;
      const result = await ResumeService.processResumeUpload(userId, req.file, targetRole);

      res.status(200).json({
        success: true,
        data: {
          fileId: result.fileRecord.id,
          fileName: result.fileRecord.originalFileName,
          parsedData: result.parsedData,
        },
        message: 'Resume uploaded and parsed successfully. Please review your details before saving.',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async improveContent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { resumeId } = req.params;
      const parsed = ResumeImprovementSchema.parse(req.body);
      const result = await ResumeService.improveResumeContent(userId, String(resumeId), parsed);

      res.status(200).json({
        success: true,
        data: result,
        message: 'AI suggestion generated.',
      });
    } catch (err) {
      next(err);
    }
  }
}
