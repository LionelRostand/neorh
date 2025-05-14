
// Types for employee data and operations
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: 'active' | 'onLeave' | 'terminated';
  hireDate: string;
  avatarUrl?: string;
}

export interface EmployeeFilter {
  field: keyof Employee | string;
  operator: '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any' | 'not-in';
  value: any;
}

export type SortDirection = 'asc' | 'desc';
