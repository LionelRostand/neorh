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
