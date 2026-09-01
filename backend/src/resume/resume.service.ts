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
  ): Promise<{
    fileName: string;
    parsedData: ResumeData;
    atsScore: number;
    categoryScores: {
      atsCompatibility: number;
      skillsMatch: number;
      keywordOptimization: number;
      experienceRelevance: number;
      resumeStructure: number;
    };
    strengths: string[];
    improvements: string[];
  }> {
    const extractedText = await ResumeParser.extractTextFromFile(file.path, file.originalname);
    const parsedData = await ResumeAIService.parseResumeText(extractedText, targetRole);

    // Calculate deterministic ATS & Category Scores based on actual resume text and parsed data
    const textLower = extractedText.toLowerCase();
    
    // 1. ATS Compatibility (Standard sections & clean text)
    let compatibility = 60;
    if (parsedData.personal?.name) compatibility += 10;
    if (parsedData.personal?.email) compatibility += 10;
    if (parsedData.experience && parsedData.experience.length > 0) compatibility += 10;
    if (parsedData.education && parsedData.education.length > 0) compatibility += 10;
    compatibility = Math.min(compatibility, 98);

    // 2. Skills Match (Count of extracted technical, tools, and domain skills)
    const totalSkills = parsedData.skills ? parsedData.skills.length : 0;
    let skillsMatch = 50;
    if (totalSkills >= 12) skillsMatch = 92;
    else if (totalSkills >= 8) skillsMatch = 85;
    else if (totalSkills >= 5) skillsMatch = 75;
    else if (totalSkills >= 2) skillsMatch = 65;
    else skillsMatch = 45;

    // 3. Keyword Optimization (Action verbs and technical density)
    const actionVerbs = [
      'developed', 'built', 'engineered', 'implemented', 'designed', 'optimized',
      'managed', 'created', 'led', 'architected', 'spearheaded', 'orchestrated',
      'scaled', 'reduced', 'improved', 'delivered', 'collaborated', 'integrated'
    ];
    let matchedVerbs = 0;
    actionVerbs.forEach(v => {
      if (textLower.includes(v)) matchedVerbs++;
    });
    let keywordOptimization = Math.min(95, Math.max(55, 50 + matchedVerbs * 3.5));

    // 4. Experience Relevance & Metrics
    const hasNumbers = /\b(\d+%|\$\d+|\d+x|\d+\+?\s*(users|clients|ms|s|teams|projects))\b/i.test(extractedText);
    let experienceRelevance = 65;
    if (parsedData.experience && parsedData.experience.length >= 2) experienceRelevance += 15;
    else if (parsedData.experience && parsedData.experience.length === 1) experienceRelevance += 8;
    if (hasNumbers) experienceRelevance += 12;
    experienceRelevance = Math.min(experienceRelevance, 96);

    // 5. Resume Structure
    let resumeStructure = 70;
    if (parsedData.summary && parsedData.summary.length > 30) resumeStructure += 10;
    if (parsedData.projects && parsedData.projects.length > 0) resumeStructure += 10;
    if (parsedData.certifications && parsedData.certifications.length > 0) resumeStructure += 5;
    resumeStructure = Math.min(resumeStructure, 95);

    // Overall Weighted ATS Score
    const atsScore = Math.round(
      compatibility * 0.25 +
      skillsMatch * 0.25 +
      keywordOptimization * 0.20 +
      experienceRelevance * 0.15 +
      resumeStructure * 0.15
    );

    // Generate dynamic strengths & improvement recommendations
    const strengths: string[] = [];
    if (totalSkills >= 6) strengths.push(`Identified ${totalSkills} high-demand technical skills and competencies`);
    if (hasNumbers) strengths.push('Contains quantifiable impact metrics and performance results');
    if (parsedData.experience?.length) strengths.push('Clear chronological career history structure');
    if (parsedData.projects?.length) strengths.push('Includes practical project demonstrations and technical artifacts');
    if (strengths.length === 0) strengths.push('Clean plain-text parsing compatibility with modern ATS engines');

    const improvements: string[] = [];
    if (!hasNumbers) improvements.push('Add quantifiable achievements (e.g. "improved speed by 35%", "scaled to 10k users")');
    if (totalSkills < 8) improvements.push('Expand modern technology stack keywords matching your target role');
    if (!parsedData.summary) improvements.push('Include a 2-sentence executive technical summary at the top');
    if (!parsedData.certifications?.length) improvements.push('Highlight industry certifications or specialized credentials');
    if (improvements.length === 0) improvements.push('Tailor keywords specifically for each target job application');

    // Clean up uploaded temp file if desired
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch {}

    return {
      fileName: file.originalname,
      parsedData,
      atsScore,
      categoryScores: {
        atsCompatibility: Math.round(compatibility),
        skillsMatch: Math.round(skillsMatch),
        keywordOptimization: Math.round(keywordOptimization),
        experienceRelevance: Math.round(experienceRelevance),
        resumeStructure: Math.round(resumeStructure),
      },
      strengths,
      improvements,
    };
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
