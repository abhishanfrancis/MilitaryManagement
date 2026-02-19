import { get, post, put, del } from './api';
import { Base } from '@/types/base';

export const baseService = {
  getAll: (params?: any) => get<Base[]>('/bases', { params }),
  getById: (id: string) => get<Base>(`/bases/${id}`),
  create: (data: Partial<Base>) => post<Base>('/bases', data),
  update: (id: string, data: Partial<Base>) => put<Base>(`/bases/${id}`, data),
  delete: (id: string) => del<{ message: string; base: Base }>(`/bases/${id}`),
  getCapacity: (id: string) => get<any>(`/bases/${id}/capacity`),
};
