import { CareerStage } from './index';
import { ItemStatus } from './roadmap.types';

export interface DashboardUserData {
  id: string;
  email: string;
  fullName: string;
  careerStage: CareerStage;
  avatarUrl?: string | null;
}

export interface DashboardCareerTarget {
  targetRole: string;
  currentLevel: string;
  targetIndustry?: string;
  preferredWorkMode?: string;
  salaryExpectation?: string;
  learningVelocity?: string;
  weeklyHoursAvailable?: number;
}

export interface DashboardReadiness {
  overall: number;
  skills: number;
  experience: number;
  projects: number;
  careerAlignment: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  reasoning: string;
}

export interface DashboardNextMove {
  status: 'ACTIVE' | 'NO_ROADMAP' | 'ALL_COMPLETE';
  taskId?: string;
  title: string;
  description?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedTime?: string;
  skills?: string[];
  whyItMatters?: string;
  phaseTitle?: string;
  phaseNumber?: number;
}

export interface DashboardSkillGapItem {
  skill: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  currentLevel: string;
  requiredLevel: string;
  learningStatus: string;
  progress: number;
  reason?: string;
}

export interface DashboardRoadmapSummary {
  hasRoadmap: boolean;
  currentPhaseNumber: number;
  totalPhases: number;
  currentPhaseTitle: string;
  currentPhaseProgress: number;
  totalTasks: number;
  completedTasks: number;
  overallProgress: number;
  currentProjectTitle?: string;
  currentProjectStatus?: ItemStatus;
}

export interface DashboardResumeSummary {
  hasResume: boolean;
  resumeId?: string;
  name?: string;
  completeness: number;
  updatedAt?: string;
}

export interface DashboardATSSummary {
  hasATS: boolean;
  analysisId?: string;
  score: number;
  matchLevel?: string;
  targetRole?: string;
  analyzedAt?: string;
  matchedKeywordsCount: number;
  missingKeywordsCount: number;
}

export interface DashboardNotification {
  id: string;
  type: 'INFO' | 'WARNING' | 'ACTION';
  title: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
}

export interface DashboardProgressMilestone {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  type: 'ONBOARDING' | 'ANALYSIS' | 'ROADMAP' | 'SKILL' | 'PROJECT' | 'RESUME' | 'ATS';
}

export interface DashboardProgressSummary {
  readinessScore: number;
  roadmapCompletion: number;
  skillsCompletedCount: number;
  totalSkillsTracked: number;
  resumeCompleteness: number;
  atsScoreLatest: number | null;
  atsScoreDelta: number | null;
  milestones: DashboardProgressMilestone[];
  trackedSkills: Array<{
    name: string;
    status: string;
    progress: number;
    priority: string;
  }>;
  atsHistory: Array<{
    id: string;
    score: number;
    targetRole: string;
    date: string;
  }>;
}

export interface DashboardAggregatedResponse {
  user: DashboardUserData;
  career: DashboardCareerTarget;
  readiness: DashboardReadiness;
  nextMove: DashboardNextMove;
  skillGaps: DashboardSkillGapItem[];
  roadmap: DashboardRoadmapSummary;
  resume: DashboardResumeSummary;
  ats: DashboardATSSummary;
  notifications: DashboardNotification[];
  progress: DashboardProgressSummary;
  topStrengths: string[];
  topWeaknesses: string[];
  topRecommendedTech: string[];
}
