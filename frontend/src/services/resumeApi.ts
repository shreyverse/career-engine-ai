
import { apiRequest } from './api';
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

    const API_BASE = import.meta.env.VITE_API_URL || '/api';
    const response = await fetch(API_BASE + '/resume/public-analyze', {
      method: 'POST',
      body: formData,
    });

    const json = await response.json();
    if (!response.ok || json.success === false) {
      throw new Error(json.error?.message || json.message || 'Failed to analyze resume.');
    }

    return json.data;
  },

  uploadResumeFile: async (file: File, targetRole?: string): Promise<ResumeUploadResponse> => {
    const formData = new FormData();
    formData.append('resume', file);
    if (targetRole) {
      formData.append('targetRole', targetRole);
    }

    const token = localStorage.getItem('career_engine_token');
    const API_BASE = import.meta.env.VITE_API_URL || '/api';

    const response = await fetch(API_BASE + '/resume/upload', {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
      },
      body: formData,
    });

    const json = await response.json();
    if (!response.ok || json.success === false) {
      throw new Error(json.error?.message || json.message || 'Failed to upload and parse resume.');
    }

    return json.data as ResumeUploadResponse;
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
