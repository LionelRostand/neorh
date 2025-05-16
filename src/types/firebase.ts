
// Types pour la collection 'employees'
export interface Employee {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: 'active' | 'onLeave' | 'terminated';
  hireDate: string;
  avatarUrl?: string;
  managerId?: string;
}

// Types pour la collection 'badges'
export interface Badge {
  id?: string;
  number: string;
  employeeId: string;
  employeeName?: string;
  type: string;
  status: 'active' | 'inactive' | 'lost' | 'pending';
  issueDate: string;
  expiryDate?: string;
  notes?: string;
}

// Types pour la collection 'accessZones'
export interface AccessZone {
  id?: string;
  name: string;
  description: string;
  securityLevel: number;
  location: string;
}

// Types pour la collection 'accessRights'
export interface AccessRight {
  id?: string;
  employeeId: string;
  badgeId: string;
  zoneId: string;
  startDate: string;
  endDate?: string;
  accessLevel: number;
}

// Types pour la collection 'accessLogs'
export interface AccessLog {
  id?: string;
  badgeId: string;
  employeeId: string;
  zoneId: string;
  timestamp: string;
  type: 'entry' | 'exit';
  status: 'authorized' | 'denied';
}

// Types pour la collection 'departments'
export interface Department {
  id?: string;
  name: string;
  description: string;
  managerId?: string;
  budget?: number;
  objectives?: string;
  color?: string;   // Added color property
  companyId?: string; // Added company reference
  parentDepartmentId?: string; // Added parent department reference
}

// Types pour la collection 'hierarchy'
export interface Hierarchy {
  id?: string;
  employeeId: string;
  managerId: string;
  level: number;
  startDate: string;
  endDate?: string;
}

// Types pour la collection 'leaves'
export interface Leave {
  id?: string;
  employeeId: string;
  type: 'annual' | 'sick' | 'maternity' | 'paternity' | 'other';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  comment?: string;
}

// Types pour la collection 'contracts'
export interface Contract {
  id?: string;
  employeeId: string;
  type: string;
  startDate: string;
  endDate?: string;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  terms?: string;
  salary?: number;
  benefits?: string;
  documents?: string[];
}

// Types for Firestore query operations
export interface QueryParams {
  field: string;
  operator: WhereFilterOp;
  value: any;
}

export interface QueryResult<T> {
  docs: Array<T & { id: string }>;
  lastDoc: DocumentSnapshot | null;
  count: number;
}

// These types are used to maintain compatibility with Firebase imports
export type WhereFilterOp = '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in';
export interface DocumentSnapshot {}
