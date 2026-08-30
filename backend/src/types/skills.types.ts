import { SkillGapItem, SkillGapLevel, PriorityLevel, GapLevel } from './careerAnalysis.types';

export type SkillLearningStatus = 'NOT_STARTED' | 'LEARNING' | 'PRACTICING' | 'COMPLETED';

export interface StoredSkillProgressRecord {
  id: string;
  userId: string;
  skillName: string;
  status: SkillLearningStatus;
  progress: number; // 0 - 100
  updatedAt: string;
}

export interface SkillGapWithProgress extends SkillGapItem {
  status: SkillLearningStatus;
  progress: number;
  userSkillId?: string;
  recommendedAction: string;
}

export interface SkillsWorkspaceData {
  targetRole: string;
  currentLevel: string;
  skillReadinessScore: number | null;
  highPriorityGaps: SkillGapWithProgress[];
  mediumPriorityGaps: SkillGapWithProgress[];
  lowPriorityGaps: SkillGapWithProgress[];
  allGaps: SkillGapWithProgress[];
  completedSkillsCount: number;
  totalGapsCount: number;
}
