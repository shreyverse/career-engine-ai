import { apiRequest } from './api';
import {
  MatchedJobResult,
  SavedJobRecord,
  JobApplicationRecord,
  JobSearchFilters,
} from '../types/jobs.types';

export const jobsApi = {
  searchJobs: async (filters: JobSearchFilters = {}): Promise<{ jobs: MatchedJobResult[]; total: number }> => {
    const params = new URLSearchParams();
    if (filters.query) params.append('query', filters.query);
    if (filters.location) params.append('location', filters.location);
    if (filters.remote !== undefined) params.append('remote', String(filters.remote));
    if (filters.remoteType) params.append('remoteType', filters.remoteType);
    if (filters.employmentType) params.append('employmentType', filters.employmentType);
    if (filters.experienceLevel) params.append('experienceLevel', filters.experienceLevel);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const res = await apiRequest<MatchedJobResult[]>(`/jobs${queryStr}`);
    return { jobs: Array.isArray(res) ? res : [], total: Array.isArray(res) ? res.length : 0 };
  },

  getRecommendedJobs: async (): Promise<MatchedJobResult[]> => {
    const res = await apiRequest<MatchedJobResult[]>('/jobs/recommended');
    return Array.isArray(res) ? res : [];
  },

  getJobById: async (jobId: string): Promise<MatchedJobResult> => {
    return apiRequest<MatchedJobResult>(`/jobs/${jobId}`);
  },

  saveJob: async (jobId: string): Promise<SavedJobRecord> => {
    return apiRequest<SavedJobRecord>(`/jobs/${jobId}/save`, {
      method: 'POST',
    });
  },

  unsaveJob: async (jobId: string): Promise<boolean> => {
    const res = await apiRequest<{ unsaved: boolean }>(`/jobs/${jobId}/save`, {
      method: 'DELETE',
    });
    return res?.unsaved || true;
  },

  getSavedJobs: async (): Promise<MatchedJobResult[]> => {
    const res = await apiRequest<MatchedJobResult[]>('/jobs/saved');
    return Array.isArray(res) ? res : [];
  },

  // Applications
  getApplications: async (): Promise<JobApplicationRecord[]> => {
    const res = await apiRequest<JobApplicationRecord[]>('/applications');
    return Array.isArray(res) ? res : [];
  },

  createApplication: async (data: Partial<JobApplicationRecord>): Promise<JobApplicationRecord> => {
    return apiRequest<JobApplicationRecord>('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateApplication: async (id: string, updates: Partial<JobApplicationRecord>): Promise<JobApplicationRecord> => {
    return apiRequest<JobApplicationRecord>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteApplication: async (id: string): Promise<boolean> => {
    const res = await apiRequest<{ deleted: boolean }>(`/applications/${id}`, {
      method: 'DELETE',
    });
    return res?.deleted || true;
  },
};
