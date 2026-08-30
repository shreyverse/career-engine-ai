import { z } from 'zod';

export const ATSAnalysisRequestSchema = z.object({
  resumeId: z.string().min(1, 'Resume ID is required.'),
  targetRole: z.string().min(2, 'Target role is required.').max(150),
  jobDescription: z.string().max(25000, 'Job description must be under 25,000 characters.').optional(),
});

export const ATSGeminiAnalysisSchema = z.object({
  matchedSkills: z.array(
    z.object({
      term: z.string(),
      category: z.string().default('TECHNICAL'),
    })
  ).default([]),
  missingSkills: z.array(
    z.object({
      term: z.string(),
      category: z.string().default('TECHNICAL'),
      importance: z.enum(['REQUIRED', 'PREFERRED']).default('REQUIRED'),
      reason: z.string().default(''),
      action: z.enum(['ADD_IF_GENUINE', 'LEARN']).default('LEARN'),
    })
  ).default([]),
  semanticMatches: z.array(
    z.object({
      resumeTerm: z.string(),
      jdTerm: z.string(),
      explanation: z.string(),
    })
  ).default([]),
  strengths: z.array(
    z.object({
      title: z.string(),
      explanation: z.string(),
    })
  ).default([]),
  contentIssues: z.array(
    z.object({
      title: z.string(),
      reason: z.string(),
      action: z.string(),
      before: z.string().optional(),
      after: z.string().optional(),
      section: z.string().default('EXPERIENCE'),
    })
  ).default([]),
  recommendations: z.array(
    z.object({
      type: z.enum(['CONTENT', 'SKILL', 'KEYWORD', 'STRUCTURE', 'EXPERIENCE', 'PROJECT', 'FORMATTING']).default('CONTENT'),
      priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
      title: z.string(),
      reason: z.string(),
      action: z.string(),
    })
  ).default([]),
});
