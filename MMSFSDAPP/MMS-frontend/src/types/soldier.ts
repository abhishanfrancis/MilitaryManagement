export interface Soldier {
  _id: string;
  serviceId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  rank: Rank | string;
  unit: { _id: string; name: string; type: string } | string;
  base: { _id: string; name: string; location: string } | string;
  dateOfBirth?: string;
  dateOfEnlistment: string;
  specialization?: string;
  status: 'Active' | 'Deployed' | 'OnLeave' | 'Retired' | 'Inactive';
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Rank {
  _id: string;
  name: string;
  abbreviation: string;
  level: number;
  category: 'Enlisted' | 'NCO' | 'Officer' | 'General';
  description?: string;
  payGrade?: string;
  createdAt: string;
  updatedAt: string;
}
