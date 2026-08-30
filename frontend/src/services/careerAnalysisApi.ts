import { apiRequest } from './api';
import { CareerAnalysisApiResponse } from '../types/careerAnalysis.types';

export const careerAnalysisApi = {
  async getLatestAnalysis(): Promise<CareerAnalysisApiResponse> {
    return apiRequest<CareerAnalysisApiResponse>('/career-analysis');
  },

  async generateAnalysis(): Promise<CareerAnalysisApiResponse> {
    return apiRequest<CareerAnalysisApiResponse>('/career-analysis', {
      method: 'POST',
    });
  },

  async regenerateAnalysis(): Promise<CareerAnalysisApiResponse> {
    return apiRequest<CareerAnalysisApiResponse>('/career-analysis/regenerate', {
      method: 'POST',
    });
  },
};