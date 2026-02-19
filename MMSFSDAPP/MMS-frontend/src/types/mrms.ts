export interface Rank {
  _id: string;
  name: string;
  abbreviation: string;
  level: number;
  category: 'Enlisted' | 'NCO' | 'Officer' | 'General';
  description?: string;
  payGrade?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Soldier {
  _id: string;
  serviceId: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  rank: Rank | string;
  unit?: Unit | string;
  base?: Base | string;
  dateOfBirth?: Date;
  dateOfEnlistment: Date;
  specialization?: string;
  status: 'Active' | 'Deployed' | 'OnLeave' | 'Retired' | 'Inactive';
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Unit {
  _id: string;
  name: string;
  type: 'Infantry' | 'Armor' | 'Artillery' | 'Engineering' | 'Signal' | 'Medical' | 'Logistics' | 'Special Forces' | 'Aviation' | 'Other';
  base?: Base | string;
  commander?: Soldier | string;
  parentUnit?: Unit | string;
  capacity: number;
  currentStrength: number;
  status: 'Active' | 'Deployed' | 'StandBy' | 'Disbanded';
  description?: string;
  establishedDate?: Date;
  members?: Soldier[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Base {
  _id: string;
  name: string;
  location: string;
  type: 'Army' | 'Navy' | 'AirForce' | 'Joint' | 'Training' | 'Logistics';
  capacity: number;
  currentOccupancy: number;
  occupancyRate?: number;
  commander?: Soldier | string;
  status: 'Operational' | 'UnderConstruction' | 'Decommissioned' | 'Restricted';
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  facilities?: string[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Equipment {
  _id: string;
  name: string;
  serialNumber: string;
  type: 'Vehicle' | 'Weapon' | 'Communication' | 'Medical' | 'Engineering' | 'Aviation' | 'Ammunition' | 'Other';
  category?: string;
  base?: Base | string;
  assignedUnit?: Unit | string;
  assignedSoldier?: Soldier | string;
  status: 'Operational' | 'UnderMaintenance' | 'Damaged' | 'Decommissioned' | 'InTransit';
  condition: 'New' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  quantity: number;
  acquisitionDate?: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Mission {
  _id: string;
  name: string;
  code: string;
  type: 'Combat' | 'Reconnaissance' | 'Peacekeeping' | 'Training' | 'Humanitarian' | 'Logistics' | 'Other';
  status: 'Planning' | 'Active' | 'Completed' | 'Cancelled' | 'OnHold';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  description?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  commander?: Soldier | string;
  assignedUnits?: Unit[];
  requiredEquipment?: Array<{
    equipment: Equipment | string;
    quantity: number;
  }>;
  personnelCount: number;
  objectives?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
