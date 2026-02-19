import { get, post, put, del } from './api';
import { Soldier, Rank } from '@/types/soldier';

export const soldierService = {
  getAll: (params?: any) => get<{ soldiers: Soldier[]; total: number; page: number; totalPages: number }>('/soldiers', { params }),
  getById: (id: string) => get<Soldier>(`/soldiers/${id}`),
  create: (data: Partial<Soldier>) => post<Soldier>('/soldiers', data),
  update: (id: string, data: Partial<Soldier>) => put<Soldier>(`/soldiers/${id}`, data),
  delete: (id: string) => del<{ message: string; soldier: Soldier }>(`/soldiers/${id}`),
};

export const rankService = {
  getAll: () => get<Rank[]>('/ranks'),
  getById: (id: string) => get<Rank>(`/ranks/${id}`),
  create: (data: Partial<Rank>) => post<Rank>('/ranks', data),
  update: (id: string, data: Partial<Rank>) => put<Rank>(`/ranks/${id}`, data),
  delete: (id: string) => del<{ message: string; rank: Rank }>(`/ranks/${id}`),
};
