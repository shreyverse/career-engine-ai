import { apiRequest } from './api';
import { SkillsWorkspaceData, SkillLearningStatus } from '../types/skills.types';

export const skillsApi = {
  getSkillsWorkspace: async (): Promise<SkillsWorkspaceData> => {
    return apiRequest<SkillsWorkspaceData>('/skills');
  },

  updateSkillProgress: async (
    skillName: string,
    status: SkillLearningStatus,
    progress: number
  ): Promise<any> => {
    return apiRequest<any>('/skills/' + encodeURIComponent(skillName), {
      method: 'PUT',
      body: JSON.stringify({ status, progress }),
    });
  },
};
