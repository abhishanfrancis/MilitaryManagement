import { get, post, put, del } from './api';
import { Soldier, Rank, Unit, Base, Equipment, Mission } from '@/types/mrms';

export const soldierService = {
  getSoldiers: async (params?: any): Promise<{ soldiers: Soldier[]; total: number }> => {
    return get<{ soldiers: Soldier[]; total: number }>('/soldiers', { params });
  },
  getSoldier: async (id: string): Promise<Soldier> => {
    return get<Soldier>(`/soldiers/${id}`);
  },
  createSoldier: async (data: Partial<Soldier>): Promise<Soldier> => {
    return post<Soldier>('/soldiers', data);
  },
  updateSoldier: async (id: string, data: Partial<Soldier>): Promise<Soldier> => {
    return put<Soldier>(`/soldiers/${id}`, data);
  },
  deleteSoldier: async (id: string): Promise<any> => {
    return del(`/soldiers/${id}`);
  }
};

export const rankService = {
  getRanks: async (): Promise<Rank[]> => {
    return get<Rank[]>('/ranks');
  },
  getRank: async (id: string): Promise<Rank> => {
    return get<Rank>(`/ranks/${id}`);
  },
  createRank: async (data: Partial<Rank>): Promise<Rank> => {
    return post<Rank>('/ranks', data);
  },
  updateRank: async (id: string, data: Partial<Rank>): Promise<Rank> => {
    return put<Rank>(`/ranks/${id}`, data);
  },
  deleteRank: async (id: string): Promise<any> => {
    return del(`/ranks/${id}`);
  }
};

export const unitService = {
  getUnits: async (params?: any): Promise<{ units: Unit[]; total: number }> => {
    return get<{ units: Unit[]; total: number }>('/units', { params });
  },
  getUnit: async (id: string): Promise<Unit> => {
    return get<Unit>(`/units/${id}`);
  },
  createUnit: async (data: Partial<Unit>): Promise<Unit> => {
    return post<Unit>('/units', data);
  },
  updateUnit: async (id: string, data: Partial<Unit>): Promise<Unit> => {
    return put<Unit>(`/units/${id}`, data);
  },
  deleteUnit: async (id: string): Promise<any> => {
    return del(`/units/${id}`);
  },
  getUnitMembers: async (id: string): Promise<Soldier[]> => {
    return get<Soldier[]>(`/units/${id}/members`);
  }
};

export const baseService = {
  getBases: async (params?: any): Promise<Base[]> => {
    return get<Base[]>('/bases', { params });
  },
  getBase: async (id: string): Promise<any> => {
    return get<any>(`/bases/${id}`);
  },
  createBase: async (data: Partial<Base>): Promise<Base> => {
    return post<Base>('/bases', data);
  },
  updateBase: async (id: string, data: Partial<Base>): Promise<Base> => {
    return put<Base>(`/bases/${id}`, data);
  },
  deleteBase: async (id: string): Promise<any> => {
    return del(`/bases/${id}`);
  },
  getCapacity: async (id: string): Promise<any> => {
    return get<any>(`/bases/${id}/capacity`);
  }
};

export const equipmentService = {
  getEquipment: async (params?: any): Promise<{ equipment: Equipment[]; total: number }> => {
    return get<{ equipment: Equipment[]; total: number }>('/equipment', { params });
  },
  getEquipmentItem: async (id: string): Promise<Equipment> => {
    return get<Equipment>(`/equipment/${id}`);
  },
  createEquipment: async (data: Partial<Equipment>): Promise<Equipment> => {
    return post<Equipment>('/equipment', data);
  },
  updateEquipment: async (id: string, data: Partial<Equipment>): Promise<Equipment> => {
    return put<Equipment>(`/equipment/${id}`, data);
  },
  deleteEquipment: async (id: string): Promise<any> => {
    return del(`/equipment/${id}`);
  },
  getStatusSummary: async (): Promise<any> => {
    return get<any>('/equipment/status-summary');
  },
  getMaintenanceDue: async (): Promise<Equipment[]> => {
    return get<Equipment[]>('/equipment/maintenance-due');
  }
};

export const missionService = {
  getMissions: async (params?: any): Promise<{ missions: Mission[]; total: number }> => {
    return get<{ missions: Mission[]; total: number }>('/missions', { params });
  },
  getMission: async (id: string): Promise<Mission> => {
    return get<Mission>(`/missions/${id}`);
  },
  createMission: async (data: Partial<Mission>): Promise<Mission> => {
    return post<Mission>('/missions', data);
  },
  updateMission: async (id: string, data: Partial<Mission>): Promise<Mission> => {
    return put<Mission>(`/missions/${id}`, data);
  },
  deleteMission: async (id: string): Promise<any> => {
    return del(`/missions/${id}`);
  },
  updateMissionStatus: async (id: string, status: string): Promise<Mission> => {
    return put<Mission>(`/missions/${id}/status`, { status });
  }
};

export interface MRMSAlert {
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  category: string;
}

export interface MRMSDashboardData {
  summary: {
    totalSoldiers: number;
    totalUnits: number;
    totalBases: number;
    totalEquipment: number;
    activeMissions: number;
    totalMissions: number;
  };
  soldiersByStatus: Array<{ status: string; count: number }>;
  equipmentByStatus: Array<{ status: string; count: number }>;
  equipmentByType: Array<{ type: string; count: number }>;
  unitsByType: Array<{ type: string; count: number }>;
  missionsByStatus: Array<{ status: string; count: number }>;
  missionsByPriority: Array<{ priority: string; count: number }>;
  alerts: MRMSAlert[];
  recentSoldiers: Soldier[];
  recentMissions: Mission[];
  recentEquipment?: Equipment[];
}

export const mrmsService = {
  getDashboard: async (): Promise<MRMSDashboardData> => {
    return get<MRMSDashboardData>('/dashboard');
  }
};
