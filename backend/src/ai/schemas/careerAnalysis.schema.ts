import { z } from 'zod';

export const SkillGapLevelEnum = z.enum(['NONE', 'BEGINNER', 'BASIC', 'INTERMEDIATE', 'ADVANCED']);
export const PriorityLevelEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);
export const GapLevelEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);
export const CurrentLevelEnum = z.enum(['BEGINNER', 'EARLY', 'INTERMEDIATE', 'ADVANCED']);
export const ProjectDifficultyEnum = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']);
export const ConfidenceEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const SkillGapItemSchema = z.object({
  skill: z.string().min(1),
  currentLevel: SkillGapLevelEnum,
  requiredLevel: SkillGapLevelEnum,
  gap: GapLevelEnum,
  priority: PriorityLevelEnum,
  reason: z.string().min(1),
});

export const RecommendedTechItemSchema = z.object({
  technology: z.string().min(1),
  priority: PriorityLevelEnum,
  reason: z.string().min(1),
  prerequisites: z.array(z.string()).default([]),
});

export const KnowledgeAreaItemSchema = z.object({
  topic: z.string().min(1),
  priority: PriorityLevelEnum,
  reason: z.string().min(1),
});

export const RecommendedProjectItemSchema = z.object({
  title: z.string().min(1),
  purpose: z.string().min(1),
  skills: z.array(z.string()).default([]),
  difficulty: ProjectDifficultyEnum,
});

export const NextActionItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  priority: PriorityLevelEnum,
  estimatedEffort: z.string().min(1),
});

export const CareerReadinessScoreSchema = z.object({
  overall: z.number().min(0).max(100).nullable(),
  skills: z.number().min(0).max(100).nullable(),
  experience: z.number().min(0).max(100).nullable(),
  projects: z.number().min(0).max(100).nullable(),
  careerAlignment: z.number().min(0).max(100).nullable(),
  confidence: ConfidenceEnum,
  reasoning: z.string().optional(),
});

export const CareerAnalysisDataSchema = z.object({
  careerSummary: z.string().min(10),
  currentLevel: CurrentLevelEnum,
  targetRole: z.string().min(1),
  strengths: z.array(z.string()).min(1),
  weaknesses: z.array(z.string()).min(1),
  skillGaps: z.array(SkillGapItemSchema).min(1),
  recommendedTechnologies: z.array(RecommendedTechItemSchema).default([]),
  knowledgeAreas: z.array(KnowledgeAreaItemSchema).default([]),
  recommendedProjects: z.array(RecommendedProjectItemSchema).min(1),
  nextActions: z.array(NextActionItemSchema).min(2).max(6),
  careerReadiness: CareerReadinessScoreSchema,
});
