import { apiRequest } from './api';
import { FullRoadmapResponse, ItemStatus } from '../types/roadmap.types';

export const roadmapApi = {
  getRoadmap: async (): Promise<FullRoadmapResponse | null> => {
    return apiRequest<FullRoadmapResponse | null>('/roadmap');
  },

  generateRoadmap: async (): Promise<FullRoadmapResponse> => {
    return apiRequest<FullRoadmapResponse>('/roadmap', {
      method: 'POST',
    });
  },

  regenerateRoadmap: async (): Promise<FullRoadmapResponse> => {
    return apiRequest<FullRoadmapResponse>('/roadmap/regenerate', {
      method: 'POST',
    });
  },

  updateTask: async (taskId: string, completed: boolean): Promise<FullRoadmapResponse> => {
    return apiRequest<FullRoadmapResponse>('/roadmap/tasks/' + encodeURIComponent(taskId), {
      method: 'PUT',
      body: JSON.stringify({ completed }),
    });
  },

  updateProject: async (projectId: string, status: ItemStatus): Promise<FullRoadmapResponse> => {
    return apiRequest<FullRoadmapResponse>('/roadmap/projects/' + encodeURIComponent(projectId), {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};
