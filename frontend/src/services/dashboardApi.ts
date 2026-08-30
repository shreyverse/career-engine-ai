import { apiRequest } from './api';
import { DashboardAggregatedResponse } from '../types/dashboard.types';

export const dashboardApi = {
  getDashboardData: async (): Promise<DashboardAggregatedResponse> => {
    return apiRequest<DashboardAggregatedResponse>('/dashboard');
  },
};
