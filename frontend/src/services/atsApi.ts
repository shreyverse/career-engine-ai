import { apiRequest } from './api';
import { ATSAnalysisRecord, ATSAnalysisRequestDto, ATSComparisonResult } from '../types/ats.types';

export const atsApi = {
  analyzeResume: async (data: ATSAnalysisRequestDto): Promise<ATSAnalysisRecord> => {
    const response = await apiRequest<{ success: boolean; data: ATSAnalysisRecord }>('/ats/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  getAnalysis: async (analysisId: string): Promise<ATSAnalysisRecord> => {
    const response = await apiRequest<{ success: boolean; data: ATSAnalysisRecord }>('/ats/' + encodeURIComponent(analysisId));
    return response.data;
  },

  getHistory: async (): Promise<ATSAnalysisRecord[]> => {
    const response = await apiRequest<{ success: boolean; data: ATSAnalysisRecord[] }>('/ats/history');
    return response.data;
  },

  compareAnalyses: async (firstId: string, secondId: string): Promise<ATSComparisonResult> => {
    const response = await apiRequest<{ success: boolean; data: ATSComparisonResult }>(
      '/ats/compare?first=' + encodeURIComponent(firstId) + '&second=' + encodeURIComponent(secondId)
    );
    return response.data;
  },
};
