export interface Mission {
  _id: string;
  name: string;
  code: string;
  type: 'Combat' | 'Reconnaissance' | 'Peacekeeping' | 'Training' | 'Humanitarian' | 'Logistics' | 'Other';
  status: 'Planning' | 'Active' | 'Completed' | 'Cancelled' | 'OnHold';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  commander: { _id: string; firstName: string; lastName: string; serviceId: string } | string | null;
  assignedUnits: { _id: string; name: string; type: string; status: string; currentStrength: number }[] | string[];
  requiredEquipment?: { equipment: any; quantity: number }[];
  personnelCount: number;
  objectives?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
