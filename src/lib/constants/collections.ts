
/**
 * Définition des constantes pour les collections Firestore
 * Cela permet de centraliser les noms de collections et d'éviter les erreurs de frappe
 */

export const HR = {
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
  LEAVE_ALLOCATIONS: 'hr_leave_allocations',
  MANAGERS: 'hr_managers',
  PAYSLIPS: 'hr_payslips',
  PERMISSIONS: 'hr_permissions',
  PROJECTS: 'hr_projets',
  RECRUITMENT: 'hr_recruitment',
  SALARIES: 'hr_salaries',
  SETTINGS: 'hr_settings',
  TIMESHEET: 'hr_timesheet',
  TRAININGS: 'hr_trainings'
};

// Pour compatibilité avec le code existant
export const COLLECTIONS = {
  ...HR
};

// Pour la compatibilité avec l'ancien mappage des routes aux collections
export const ROUTE_TO_COLLECTION_MAP = {
  '/employes': HR.EMPLOYEES,
  '/badges': HR.BADGES,
  '/hierarchie': 'hr_hierarchy',
  '/feuilles-de-temps': HR.TIMESHEET,
  '/presences': HR.ATTENDANCE,
  '/conges': HR.LEAVES,
  '/contrats': HR.CONTRACTS,
  '/documents': HR.DOCUMENTS,
  '/formations': HR.TRAININGS,
  '/salaires': HR.PAYSLIPS,
  '/projets': HR.PROJECTS,
};
