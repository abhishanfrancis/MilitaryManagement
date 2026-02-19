export interface DashboardSummary {
  totalSoldiers: number;
  totalUnits: number;
  totalBases: number;
  totalEquipment: number;
  activeMissions: number;
  totalMissions: number;
}

export interface AggregateItem {
  _id: string;
  count: number;
}

export interface SystemAlert {
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  category: string;
}

export interface RecentSoldier {
  _id: string;
  firstName: string;
  lastName: string;
  serviceId: string;
  status: string;
  rank?: { name: string; abbreviation: string };
  base?: { name: string };
  createdAt: string;
}

export interface RecentMission {
  _id: string;
  name: string;
  code: string;
  type: string;
  status: string;
  priority: string;
  startDate?: string;
  commander?: { firstName: string; lastName: string };
  createdAt: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  soldiersByStatus: AggregateItem[];
  equipmentByStatus: AggregateItem[];
  equipmentByType: AggregateItem[];
  unitsByType: AggregateItem[];
  missionsByStatus: AggregateItem[];
  missionsByPriority: AggregateItem[];
  alerts: SystemAlert[];
  recentSoldiers: RecentSoldier[];
  recentMissions: RecentMission[];
}