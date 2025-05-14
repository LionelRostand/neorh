
import { 
  DocumentData, 
  CollectionReference,
  Query,
  QueryConstraint,
} from "firebase/firestore";

export type FirestoreFilter = {
  field: string;
  operator: "==" | "!=" | ">" | ">=" | "<" | "<=";
  value: any;
}

export type FirestoreSortDirection = "asc" | "desc";

export interface FirestoreOperationResult<T> {
  data?: T;
  success: boolean;
  error?: Error;
}

export interface FirestoreService<T extends Record<string, any>> {
  getAll: () => Promise<(T & { id: string })[]>;
  getById: (id: string) => Promise<(T & { id: string }) | null>;
  add: (data: Omit<T, 'id'>) => Promise<(T & { id: string }) | null>;
  update: (id: string, data: Partial<T>) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  search: (
    filters: FirestoreFilter[],
    sortField?: string,
    sortDirection?: FirestoreSortDirection
  ) => Promise<(T & { id: string })[]>;
  isLoading: boolean;
  error: Error | null;
}
