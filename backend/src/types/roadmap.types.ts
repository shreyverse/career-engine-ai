export type PhaseType =
  | 'FOUNDATION'
  | 'SKILL_BUILDING'
  | 'PRACTICE'
  | 'PROJECT'
  | 'PORTFOLIO'
  | 'INTERVIEW'
  | 'APPLICATION';

export type TaskType =
  | 'LEARNING'
  | 'PRACTICE'
  | 'PROJECT'
  | 'READING'
  | 'ASSESSMENT'
  | 'PORTFOLIO'
  | 'INTERVIEW';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type ItemStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface RoadmapTaskItem {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  estimatedTime: string;
  priority: TaskPriority;
  skills: string[];
  prerequisites?: string[];
  completed?: boolean;
}

export interface RoadmapProjectItem {
  id: string;
  title: string;
  description: string;
  skills: string[];
  status?: ItemStatus;
}

export interface RoadmapPhaseSkill {
  name: string;
  reason: string;
}

export interface RoadmapPhaseItem {
  id: string;
  phaseNumber: number;
  phaseType: PhaseType;
  title: string;
  description: string;
  estimatedDuration: string;
  objectives: string[];
  skills: RoadmapPhaseSkill[];
  tasks: RoadmapTaskItem[];
  project?: RoadmapProjectItem;
  completionCriteria: string[];
  progress?: number;
}

export interface NextMoveItem {
  taskId: string;
  phaseId: string;
  phaseTitle: string;
  title: string;
  description: string;
  priority: TaskPriority;
  estimatedTime: string;
  type: TaskType;
  why: string;
}

export interface RoadmapData {
  targetRole: string;
  currentLevel: string;
  estimatedDuration: string;
  phases: RoadmapPhaseItem[];
}

export interface StoredRoadmapRecord {
  id: string;
  userId: string;
  sourceAnalysisId: string;
  version: number;
  targetRole: string;
  estimatedDuration: string;
  roadmapData: RoadmapData;
  createdAt: string;
  updatedAt: string;
}

export interface StoredTaskProgressRecord {
  id: string;
  userId: string;
  roadmapId: string;
  taskId: string;
  status: ItemStatus;
  completedAt: string | null;
  updatedAt: string;
}

export interface StoredProjectProgressRecord {
  id: string;
  userId: string;
  roadmapId: string;
  projectId: string;
  status: ItemStatus;
  completedAt: string | null;
  updatedAt: string;
}

export interface FullRoadmapResponse {
  roadmap: RoadmapData;
  metadata: {
    id: string;
    version: number;
    sourceAnalysisId: string;
    createdAt: string;
    updatedAt: string;
  };
  progress: {
    overallProgress: number;
    completedTasksCount: number;
    totalTasksCount: number;
    completedProjectsCount: number;
    totalProjectsCount: number;
    currentPhase: {
      phaseNumber: number;
      title: string;
      phaseType: PhaseType;
    } | null;
  };
  nextMove: NextMoveItem | null;
  isStale?: boolean;
}
