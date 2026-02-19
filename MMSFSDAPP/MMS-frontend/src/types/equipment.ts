export interface Equipment {
  _id: string;
  name: string;
  serialNumber: string;
  type: 'Vehicle' | 'Weapon' | 'Communication' | 'Medical' | 'Engineering' | 'Aviation' | 'Ammunition' | 'Other';
  category?: string;
  base: { _id: string; name: string } | string;
  assignedUnit: { _id: string; name: string } | string | null;
  assignedSoldier: { _id: string; firstName: string; lastName: string; serviceId: string } | string | null;
  status: 'Operational' | 'UnderMaintenance' | 'Damaged' | 'Decommissioned' | 'InTransit';
  condition: 'New' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  quantity: number;
  acquisitionDate?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
