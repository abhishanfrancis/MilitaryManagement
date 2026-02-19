import { get, post, put, del } from './api';
import { Unit } from '@/types/unit';

export const unitService = {
  getAll: (params?: any) => get<{ units: Unit[]; total: number; page: number; totalPages: number }>('/units', { params }),
  getById: (id: string) => get<Unit>(`/units/${id}`),
  create: (data: Partial<Unit>) => post<Unit>('/units', data),
  update: (id: string, data: Partial<Unit>) => put<Unit>(`/units/${id}`, data),
  delete: (id: string) => del<{ message: string; unit: Unit }>(`/units/${id}`),
  getMembers: (id: string) => get<any[]>(`/units/${id}/members`),
};
