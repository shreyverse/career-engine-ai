export type CoachRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

export interface CoachMessageAction {
  title: string;
  reason: string;
  actionUrl?: string;
  actionType?: 'OPEN_TASK' | 'OPEN_ROADMAP' | 'OPEN_RESUME' | 'OPEN_ATS' | 'OPEN_SKILLS' | 'OPEN_SETTINGS';
}

export interface CoachMessageReference {
  type: 'ROADMAP_TASK' | 'SKILL' | 'RESUME' | 'ATS' | 'CAREER_ANALYSIS';
  id: string;
  label?: string;
}

export interface CoachMessage {
  id: string;
  conversationId: string;
  role: CoachRole;
  content: string;
  actions?: CoachMessageAction[];
  references?: CoachMessageReference[];
  suggestedFollowUps?: string[];
  createdAt: string;
}

export interface CoachConversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: CoachMessage[];
}

export interface CoachStructuredResponse {
  message: string;
  actions?: CoachMessageAction[];
  references?: CoachMessageReference[];
  suggestedFollowUps?: string[];
}

export interface WeeklyPlanTask {
  taskId: string;
  title: string;
  description?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedTime: string;
  completed: boolean;
  skills: string[];
  phaseTitle: string;
}

export interface WeeklyPlan {
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
  activePhaseTitle: string;
  activePhaseNumber: number;
  tasks: WeeklyPlanTask[];
}
