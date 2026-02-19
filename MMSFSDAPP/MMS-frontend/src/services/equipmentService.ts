import { get, post, put, del } from './api';
import { Equipment } from '@/types/equipment';

export const equipmentService = {
  getAll: (params?: any) => get<{ equipment: Equipment[]; total: number; page: number; totalPages: number }>('/equipment', { params }),
  getById: (id: string) => get<Equipment>(`/equipment/${id}`),
  create: (data: Partial<Equipment>) => post<Equipment>('/equipment', data),
  update: (id: string, data: Partial<Equipment>) => put<Equipment>(`/equipment/${id}`, data),
  delete: (id: string) => del<{ message: string; equipment: Equipment }>(`/equipment/${id}`),
  getStatusSummary: () => get<any>('/equipment/status-summary'),
  getMaintenanceDue: () => get<Equipment[]>('/equipment/maintenance-due'),
};
