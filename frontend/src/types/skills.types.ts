export type SkillLearningStatus = 'NOT_STARTED' | 'LEARNING' | 'PRACTICING' | 'COMPLETED';

export interface SkillGapWithProgress {
  skill: string;
  currentLevel: 'NONE' | 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  requiredLevel: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  gap: 'LOW' | 'MEDIUM' | 'HIGH';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  reason: string;
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
