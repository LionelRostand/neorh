
// Define the mapping between routes and Firestore collections
export const ROUTE_TO_COLLECTION_MAP = {
  '/employes': 'hr_employees',
  '/badges': 'hr_badges',
  '/hierarchie': 'hr_hierarchy',
  '/feuilles-de-temps': 'hr_timesheets',
  '/presences': 'hr_presence',
  '/conges': 'hr_leaves',
  '/contrats': 'hr_contracts',
};

// Define the collection types to provide correct typing
export interface CollectionTypes {
  hr_employees: any;
  hr_badges: any;
  hr_hierarchy: any;
  hr_timesheets: any;
  hr_presence: any;
  hr_leaves: any;
  hr_contracts: any;
}

export type Leave = {
  id?: string;
  employeeId: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
}

export type Badge = {
  id?: string;
  number: string;
  employeeId: string;
  type: string;
  status: 'active' | 'inactive' | 'lost' | 'pending';
  issueDate: string;
  expiryDate: string;
}

export type Timesheet = {
  id?: string;
  employeeId: string;
  weekStartDate: string;
  weekEndDate: string;
  hours: number;
  status: string;
  submittedDate?: string;
  approvedBy?: string;
  approvalDate?: string;
}

export type Contract = {
  id?: string;
  employeeId: string;
  employeeName?: string;
  position?: string;
  type: string;
  startDate: string;
  endDate?: string;
  status: 'draft' | 'active' | 'expired' | 'pending';
}

