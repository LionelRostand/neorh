
export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  managerId?: string;
  startDate: string;
  status: 'active' | 'inactive' | 'onLeave';
}
