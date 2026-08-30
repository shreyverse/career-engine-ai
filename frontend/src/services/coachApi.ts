import { apiRequest } from './api';
import {
  CoachConversation,
  CoachMessage,
  WeeklyPlan,
} from '../types/coach.types';

export const coachApi = {
  createConversation: async (title?: string, initialMessage?: string): Promise<CoachConversation> => {
    return apiRequest<CoachConversation>('/coach/conversations', {
      method: 'POST',
      body: JSON.stringify({ title, initialMessage }),
    });
  },

  listConversations: async (): Promise<CoachConversation[]> => {
    return apiRequest<CoachConversation[]>('/coach/conversations');
  },

  getConversation: async (id: string): Promise<CoachConversation> => {
    return apiRequest<CoachConversation>(`/coach/conversations/${id}`);
  },

  sendMessage: async (
    conversationId: string,
    message: string
  ): Promise<{ userMessage: CoachMessage; assistantMessage: CoachMessage }> => {
    return apiRequest<{ userMessage: CoachMessage; assistantMessage: CoachMessage }>(
      `/coach/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        body: JSON.stringify({ message }),
      }
    );
  },

  deleteConversation: async (id: string): Promise<boolean> => {
    const res = await apiRequest<{ deleted: boolean }>(`/coach/conversations/${id}`, {
      method: 'DELETE',
    });
    return res?.deleted || true;
  },

  getWeeklyPlan: async (): Promise<WeeklyPlan> => {
    return apiRequest<WeeklyPlan>('/coach/weekly-plan');
  },
};
