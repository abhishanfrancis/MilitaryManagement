export interface Unit {
  _id: string;
  name: string;
  type: 'Infantry' | 'Armor' | 'Artillery' | 'Engineering' | 'Signal' | 'Medical' | 'Logistics' | 'Special Forces' | 'Aviation' | 'Other';
  base: { _id: string; name: string; location: string } | string;
  commander: { _id: string; firstName: string; lastName: string; serviceId: string } | string | null;
  parentUnit: { _id: string; name: string } | string | null;
  capacity: number;
  currentStrength: number;
  status: 'Active' | 'Deployed' | 'StandBy' | 'Disbanded';
  description?: string;
  establishedDate?: string;
  members?: any[];
  createdAt: string;
  updatedAt: string;
}
