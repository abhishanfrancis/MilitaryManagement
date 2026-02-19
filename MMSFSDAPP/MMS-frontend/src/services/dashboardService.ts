import { get } from './api';
import { DashboardData } from '@/types/dashboard';

export type { DashboardData };

export const dashboardService = {
  getDashboardData: async (params?: any): Promise<DashboardData> => {
    return get<DashboardData>('/dashboard', { params });
  }
};