import fs from 'fs';
import { db } from '../config/database';
import {
  ResumeData,
  StoredResumeRecord,
  StoredResumeFileRecord,
  ResumeStatus,
  ResumeImprovementRequest,
  ResumeImprovementResponse,
} from '../types/resume.types';
import { ATSPipeline } from '../ats/ats.pipeline';
import { calculateResumeCompleteness } from './resume.schema';
import { ResumeParser } from './resume.parser';
import { ResumeAIService } from './resume.ai.service';

export class ResumeService {
  public static async listResumes(userId: string): Promise<StoredResumeRecord[]> {
    return db.getUserResumes(userId);
  }

  public static async getResumeById(userId: string, resumeId: string): Promise<StoredResumeRecord | null> {
    const resume = await db.getResumeById(resumeId);
    if (!resume) return null;
    if (resume.userId !== userId) {
      const err: any = new Error('Access denied: You do not own this resume.');
      err.statusCode = 403;
      err.code = 'FORBIDDEN';
      throw err;
    }
    return resume;
  }

  public static async createResume(
    userId: string,
    params: {
      name: string;
      targetRole: string;
      status?: ResumeStatus;
      data?: ResumeData;
    }
  ): Promise<StoredResumeRecord> {
    const defaultData: ResumeData = params.data || {
      personal: { name: '', email: '' },
      summary: '',
      education: [],
      experience: [],
      skills: [],
      projects: [],
      certifications: [],
      achievements: [],
      targetRole: params.targetRole,
    };

    const completeness = calculateResumeCompleteness(defaultData);

    return db.saveResume({
      userId,
      name: params.name.trim(),
      targetRole: params.targetRole.trim(),
      status: params.status || 'DRAFT',
      completeness,
      data: defaultData,
    });
  }

  public static async updateResume(
    userId: string,
    resumeId: string,
    updates: {
      name?: string;
      targetRole?: string;
      status?: ResumeStatus;
      data?: ResumeData;
    }
  ): Promise<StoredResumeRecord> {
    const existing = await this.getResumeById(userId, resumeId);
    if (!existing) {
      const err: any = new Error('Resume not found.');
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    const updatedData = updates.data || existing.data;
    const completeness = calculateResumeCompleteness(updatedData);

    return db.updateResume(resumeId, {
      name: updates.name ? updates.name.trim() : existing.name,
      targetRole: updates.targetRole ? updates.targetRole.trim() : existing.targetRole,
      status: updates.status || existing.status,
      completeness,
      data: updatedData,
    });
  }

  public static async deleteResume(userId: string, resumeId: string): Promise<boolean> {
    await this.getResumeById(userId, resumeId);
    return db.deleteResume(resumeId);
  }

  public static async processResumeUpload(
    userId: string,
    file: Express.Multer.File,
    targetRole?: string
  ): Promise<{ fileRecord: StoredResumeFileRecord; parsedData: ResumeData }> {
    const extractedText = await ResumeParser.extractTextFromFile(file.path, file.originalname);

    const fileRecord = await db.saveResumeFile({
      userId,
      storageKey: file.path,
      originalFileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      extractedText,
    });

    const parsedData = await ResumeAIService.parseResumeText(extractedText, targetRole);

    return {
      fileRecord,
      parsedData,
    };
  }

  public static async publicAnalyzeResume(
    file: Express.Multer.File,
    targetRole?: string
  ) {
    return ATSPipeline.analyzeResume(file, targetRole);
  }

  public static async improveResumeContent(
    userId: string,
    resumeId: string,
    req: ResumeImprovementRequest
  ): Promise<ResumeImprovementResponse> {
    await this.getResumeById(userId, resumeId);
    return ResumeAIService.improveContent(req);
  }
}
