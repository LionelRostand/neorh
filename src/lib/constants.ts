
// Collections Firebase
export const FIREBASE_COLLECTIONS = {
  HR: {
    ABSENCE_REQUESTS: 'hr_absence_requests',
    ALERTS: 'hr_alerts',
    ATTENDANCE: 'hr_attendance',
    BADGES: 'hr_badges',
    CONTRACTS: 'hr_contracts',
    DEPARTMENTS: 'hr_departments',
    DOCUMENTS: 'hr_documents',
    EMPLOYEES: 'hr_employees',
    EVALUATIONS: 'hr_evaluations',
    LEAVE_REQUESTS: 'hr_leave_requests',
    LEAVES: 'hr_leaves',
    MANAGERS: 'hr_managers',
    PAYSLIPS: 'hr_payslips',
    PERMISSIONS: 'hr_permissions',
    RECRUITMENT: 'hr_recruitment',
    SALARIES: 'hr_salaries',
    SETTINGS: 'hr_settings',
    TIMESHEET: 'hr_timesheet',
    TRAININGS: 'hr_trainings'
  }
};

// Mapping des routes vers les collections Firebase
export const ROUTE_TO_COLLECTION_MAP = {
  '/': FIREBASE_COLLECTIONS.HR.EMPLOYEES, // Tableau de bord (utilise données employés)
  '/employes': FIREBASE_COLLECTIONS.HR.EMPLOYEES,
  '/badges': FIREBASE_COLLECTIONS.HR.BADGES,
  '/hierarchie': FIREBASE_COLLECTIONS.HR.MANAGERS,
  '/presences': FIREBASE_COLLECTIONS.HR.ATTENDANCE,
  '/feuilles-de-temps': FIREBASE_COLLECTIONS.HR.TIMESHEET,
  '/conges': FIREBASE_COLLECTIONS.HR.LEAVES,
  '/contrats': FIREBASE_COLLECTIONS.HR.CONTRACTS,
  '/documents': FIREBASE_COLLECTIONS.HR.DOCUMENTS,
  '/departements': FIREBASE_COLLECTIONS.HR.DEPARTMENTS,
  '/evaluations': FIREBASE_COLLECTIONS.HR.EVALUATIONS,
  '/formations': FIREBASE_COLLECTIONS.HR.TRAININGS,
  '/salaires': FIREBASE_COLLECTIONS.HR.SALARIES,
  '/recrutement': FIREBASE_COLLECTIONS.HR.RECRUITMENT,
  '/entreprises': FIREBASE_COLLECTIONS.HR.SETTINGS,
  '/rapports': FIREBASE_COLLECTIONS.HR.EMPLOYEES, // Utilise plusieurs collections
  '/alertes': FIREBASE_COLLECTIONS.HR.ALERTS,
  '/parametres': FIREBASE_COLLECTIONS.HR.SETTINGS
};

// Types pour chaque collection
export interface CollectionTypes {
  [FIREBASE_COLLECTIONS.HR.ABSENCE_REQUESTS]: AbsenceRequest;
  [FIREBASE_COLLECTIONS.HR.ALERTS]: Alert;
  [FIREBASE_COLLECTIONS.HR.ATTENDANCE]: Attendance;
  [FIREBASE_COLLECTIONS.HR.BADGES]: Badge;
  [FIREBASE_COLLECTIONS.HR.CONTRACTS]: Contract;
  [FIREBASE_COLLECTIONS.HR.DEPARTMENTS]: Department;
  [FIREBASE_COLLECTIONS.HR.DOCUMENTS]: Document;
  [FIREBASE_COLLECTIONS.HR.EMPLOYEES]: Employee;
  [FIREBASE_COLLECTIONS.HR.EVALUATIONS]: Evaluation;
  [FIREBASE_COLLECTIONS.HR.LEAVE_REQUESTS]: LeaveRequest;
  [FIREBASE_COLLECTIONS.HR.LEAVES]: Leave;
  [FIREBASE_COLLECTIONS.HR.MANAGERS]: Manager;
  [FIREBASE_COLLECTIONS.HR.PAYSLIPS]: Payslip;
  [FIREBASE_COLLECTIONS.HR.PERMISSIONS]: Permission;
  [FIREBASE_COLLECTIONS.HR.RECRUITMENT]: Recruitment;
  [FIREBASE_COLLECTIONS.HR.SALARIES]: Salary;
  [FIREBASE_COLLECTIONS.HR.SETTINGS]: Setting;
  [FIREBASE_COLLECTIONS.HR.TIMESHEET]: Timesheet;
  [FIREBASE_COLLECTIONS.HR.TRAININGS]: Training;
}

// Interfaces pour les différents types de documents
export interface Employee {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  status: 'active' | 'inactive' | 'onLeave';
  hireDate: string;
  managerId?: string;
}

export interface Badge {
  id?: string;
  number: string;
  employeeId: string;
  employeeName: string;
  type: string;
  status: 'active' | 'inactive' | 'lost';
  issueDate: string;
  expiryDate: string;
}

export interface Manager {
  id?: string;
  employeeId: string;
  departmentId: string;
  level: number;
  reportToId?: string;
}

export interface Department {
  id?: string;
  name: string;
  description: string;
  managerId?: string;
  parentDepartmentId?: string;
  employeeCount?: number;
}

export interface Timesheet {
  id?: string;
  employeeId: string;
  date: string;
  projectId?: string;
  taskDescription: string;
  hoursWorked: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
}

// Interfaces pour les autres types (versions simplifiées)
export interface AbsenceRequest { id?: string; employeeId: string; type: string; startDate: string; endDate: string; status: string; }
export interface Alert { id?: string; title: string; description: string; type: string; date: string; }
export interface Attendance { id?: string; employeeId: string; date: string; timeIn: string; timeOut: string; }
export interface Contract { id?: string; employeeId: string; type: string; startDate: string; endDate?: string; }
export interface Document { id?: string; title: string; type: string; path: string; employeeId?: string; }
export interface Evaluation { id?: string; employeeId: string; evaluatorId: string; date: string; score: number; }
export interface LeaveRequest { id?: string; employeeId: string; type: string; startDate: string; endDate: string; status: string; }
export interface Leave { id?: string; employeeId: string; type: string; startDate: string; endDate: string; status: string; }
export interface Payslip { id?: string; employeeId: string; period: string; amount: number; }
export interface Permission { id?: string; role: string; resource: string; action: string; }
export interface Recruitment { id?: string; position: string; status: string; openDate: string; closeDate?: string; }
export interface Salary { id?: string; employeeId: string; amount: number; effectiveDate: string; }
export interface Setting { id?: string; key: string; value: string; }
export interface Training { id?: string; title: string; description: string; startDate: string; endDate: string; }

