// Define the mapping between routes and Firestore collections
export const ROUTE_TO_COLLECTION_MAP = {
  '/employes': 'hr_employees',
  '/badges': 'hr_badges',
  '/hierarchie': 'hr_hierarchy',
  '/feuilles-de-temps': 'hr_timesheets',
  '/presences': 'hr_presence',
  '/conges': 'hr_leaves',
  '/contrats': 'hr_contracts',
  '/documents': 'hr_documents',
  '/formations': 'hr_trainings',
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
  hr_documents: any;
  hr_trainings: any;
  hr_leave_allocations: any;
}

export type Leave = {
  id?: string;
  employeeId: string;
  type: string;  // paid, rtt, sick, family, maternity, paternity
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  managerId?: string; // ID du responsable qui doit approuver la demande
  createdAt?: string;
  daysAllocated?: number;
  isAllocation?: boolean;
}

export type LeaveAllocation = {
  id?: string;
  employeeId: string;
  year: number;
  paidLeavesTotal: number;
  paidLeavesUsed: number;
  rttTotal: number;
  rttUsed: number;
  updatedAt: string;
  updatedBy?: string;
}

export type Badge = {
  id?: string;
  number: string;
  employeeId: string;
  employeeName?: string;
  type: string;
  status: 'active' | 'inactive' | 'lost' | 'pending';
  issueDate: string;
  expiryDate?: string;
}

export type Timesheet = {
  id?: string;
  employeeId: string;
  date?: string; 
  projectId?: string;
  taskDescription?: string;
  hoursWorked?: number;
  weekStartDate: string;
  weekEndDate: string;
  hours: number;
  status: string;
  submittedAt?: string;
  approvedAt?: string;
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

export type Document = {
  id?: string;
  title: string;
  employeeId?: string;
  employeeName?: string;
  category: string;
  fileUrl: string;
  fileType: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'active' | 'archived' | 'pending';
}

export type Training = {
  id?: string;
  title: string;
  description: string;
  trainer: string;
  department: string;
  participants: number;
  startDate: string;
  endDate?: string;
  status: 'planifiée' | 'complétée' | 'annulée';
}
