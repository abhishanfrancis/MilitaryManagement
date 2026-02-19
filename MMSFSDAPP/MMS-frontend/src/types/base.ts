export interface Base {
  _id: string;
  name: string;
  location: string;
  type: 'Army' | 'Navy' | 'AirForce' | 'Joint' | 'Training' | 'Logistics';
  capacity: number;
  currentOccupancy: number;
  occupancyRate: number;
  commander: { _id: string; firstName: string; lastName: string; serviceId: string } | string | null;
  status: 'Operational' | 'UnderConstruction' | 'Decommissioned' | 'Restricted';
  coordinates?: { latitude: number; longitude: number };
  facilities?: string[];
  description?: string;
  unitCount?: number;
  soldierCount?: number;
  equipmentCount?: number;
  createdAt: string;
  updatedAt: string;
}
