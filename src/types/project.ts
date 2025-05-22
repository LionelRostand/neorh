
export interface Project {
  id?: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: 'active' | 'pending' | 'completed' | 'canceled';
  managerId?: string;
  budget?: number;
  clientId?: string;
  createdAt?: string;
  updatedAt?: string;
}
