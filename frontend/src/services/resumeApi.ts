
import { apiRequest, apiUploadRequest } from './api';
import {
  StoredResumeRecord,
  ResumeData,
  ResumeStatus,
  ResumeImprovementRequest,
  ResumeImprovementResponse,
  ResumeUploadResponse,
} from '../types/resume.types';

export const resumeApi = {
  listResumes: async (): Promise<StoredResumeRecord[]> => {
    return apiRequest<StoredResumeRecord[]>('/resumes');
  },

  getResume: async (resumeId: string): Promise<StoredResumeRecord> => {
    return apiRequest<StoredResumeRecord>('/resumes/' + encodeURIComponent(resumeId));
  },

  createResume: async (payload: {
    name: string;
    targetRole: string;
    status?: ResumeStatus;
    data?: ResumeData;
  }): Promise<StoredResumeRecord> => {
    return apiRequest<StoredResumeRecord>('/resumes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateResume: async (
    resumeId: string,
    payload: {
      name?: string;
      targetRole?: string;
      status?: ResumeStatus;
      data?: ResumeData;
    }
  ): Promise<StoredResumeRecord> => {
    return apiRequest<StoredResumeRecord>('/resumes/' + encodeURIComponent(resumeId), {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteResume: async (resumeId: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>('/resumes/' + encodeURIComponent(resumeId), {
      method: 'DELETE',
    });
  },

  publicAnalyzeResume: async (file: File, targetRole?: string): Promise<{
    fileName: string;
    parsedData: any;
    atsScore: number;
    categoryScores: {
      atsCompatibility: number;
      skillsMatch: number;
      keywordOptimization: number;
      experienceRelevance: number;
      resumeStructure: number;
    };
    strengths: string[];
    improvements: string[];
  }> => {
    const formData = new FormData();
    formData.append('resume', file);
    if (targetRole) {
      formData.append('targetRole', targetRole);
    }

    const res = await apiUploadRequest<any>('/resume/public-analyze', formData);
    return res.data;
  },

  uploadResumeFile: async (file: File, targetRole?: string): Promise<ResumeUploadResponse> => {
    const formData = new FormData();
    formData.append('resume', file);
    if (targetRole) {
      formData.append('targetRole', targetRole);
    }

    const res = await apiUploadRequest<ResumeUploadResponse>('/resume/upload', formData);
    return res.data!;
  },

  improveContent: async (
    resumeId: string,
    req: ResumeImprovementRequest
  ): Promise<ResumeImprovementResponse> => {
    return apiRequest<ResumeImprovementResponse>(
      '/resumes/' + encodeURIComponent(resumeId) + '/improve',
      {
        method: 'POST',
        body: JSON.stringify(req),
      }
    );
  },
};
