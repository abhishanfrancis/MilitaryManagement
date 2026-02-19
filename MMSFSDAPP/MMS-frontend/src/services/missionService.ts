import { get, post, put, del } from './api';
import { Mission } from '@/types/mission';

export const missionService = {
  getAll: (params?: any) => get<{ missions: Mission[]; total: number; page: number; totalPages: number }>('/missions', { params }),
  getById: (id: string) => get<Mission>(`/missions/${id}`),
  create: (data: Partial<Mission>) => post<Mission>('/missions', data),
  update: (id: string, data: Partial<Mission>) => put<Mission>(`/missions/${id}`, data),
  updateStatus: (id: string, status: string) => put<Mission>(`/missions/${id}/status`, { status }),
  delete: (id: string) => del<{ message: string; mission: Mission }>(`/missions/${id}`),
};
