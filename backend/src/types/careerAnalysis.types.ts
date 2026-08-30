export type CurrentLevel = 'BEGINNER' | 'EARLY' | 'INTERMEDIATE' | 'ADVANCED';
export type SkillGapLevel = 'NONE' | 'BEGINNER' | 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type GapLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ProjectDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface SkillGapItem {
  skill: string;
  currentLevel: SkillGapLevel;
  requiredLevel: SkillGapLevel;
  gap: GapLevel;
  priority: PriorityLevel;
  reason: string;
}

export interface RecommendedTechItem {
  technology: string;
  priority: PriorityLevel;
  reason: string;
  prerequisites: string[];
}

export interface KnowledgeAreaItem {
  topic: string;
  priority: PriorityLevel;
  reason: string;
}

export interface RecommendedProjectItem {
  title: string;
  purpose: string;
  skills: string[];
  difficulty: ProjectDifficulty;
}

export interface NextActionItem {
  title: string;
  description: string;
  priority: PriorityLevel;
  estimatedEffort: string;
}

export interface CareerReadinessScore {
  overall: number | null;
  skills: number | null;
  experience: number | null;
  projects: number | null;
  careerAlignment: number | null;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  reasoning?: string;
}

export interface CareerAnalysisData {
  careerSummary: string;
  currentLevel: CurrentLevel;
  targetRole: string;
  strengths: string[];
  weaknesses: string[];
  skillGaps: SkillGapItem[];
  recommendedTechnologies: RecommendedTechItem[];
  knowledgeAreas: KnowledgeAreaItem[];
  recommendedProjects: RecommendedProjectItem[];
  nextActions: NextActionItem[];
  careerReadiness: CareerReadinessScore;
}

export interface StoredCareerAnalysisRecord {
  id: string;
  userId: string;
  careerType: 'FRESHER' | 'PROFESSIONAL';
  targetRole: string;
  analysisData: CareerAnalysisData;
  model: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}
