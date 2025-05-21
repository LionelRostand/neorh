import { query, where, orderBy, limit, getDocs, FirestoreError, CollectionReference, WhereFilterOp } from "firebase/firestore";

export interface SearchCriteria {
  field: string;
  value: any;
  operator?: WhereFilterOp;
}

interface SearchOperationsResult<T> {
  docs?: T[];
  error?: Error;
}

export const createSearchOperations = <T extends Record<string, any>>(
  setIsLoading: (value: boolean) => void,
  setError: (value: Error | null) => void,
  getCollection: () => CollectionReference<T>
) => {
  /**
   * Search for documents matching a specific field value
   */
  const search = async (
    criteria: SearchCriteria | string, 
    value?: any,
    options?: { 
      sortField?: string;
      sortDirection?: 'asc' | 'desc';
      limitTo?: number;
    }
  ): Promise<SearchOperationsResult<T>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Handle both old and new API formats
      let field: string;
      let searchValue: any;
      let operator: WhereFilterOp = '==';
      
      // Check if first parameter is SearchCriteria object or string
      if (typeof criteria === 'string') {
        field = criteria;
        searchValue = value;
      } else {
        field = criteria.field;
        searchValue = criteria.value;
        operator = criteria.operator || '==';
      }
      
      let q = query(getCollection(), where(field, operator, searchValue));
      
      if (options?.sortField) {
        q = query(q, orderBy(options.sortField, options.sortDirection || 'asc'));
      }
      
      if (options?.limitTo) {
        q = query(q, limit(options.limitTo));
      }
      
      const querySnapshot = await getDocs(q);
      const documents: T[] = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() } as T);
      });
      
      console.info(`Retrieved ${documents.length} documents from search`);
      return { docs: documents };
    } catch (error) {
      const firestoreError = error as FirestoreError;
      console.error(`Error searching documents:`, firestoreError);
      setError(new Error(firestoreError.message));
      return { error: firestoreError };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Search for documents with a field that contains a specific substring
   * Note: This requires a composite index in Firestore
   */
  const searchWithContains = async (
    field: string,
    value: string,
    options?: {
      sortField?: string;
      sortDirection?: 'asc' | 'desc';
      limitTo?: number;
    }
  ): Promise<SearchOperationsResult<T>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get all documents and filter in memory
      // Firestore doesn't support native contains queries
      const snapshot = await getDocs(getCollection());
      
      let documents: T[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const fieldValue = String(data[field] || '').toLowerCase();
        
        if (fieldValue.includes(value.toLowerCase())) {
          documents.push({ id: doc.id, ...data } as T);
        }
      });
      
      // Apply sorting if needed
      if (options?.sortField) {
        documents = documents.sort((a, b) => {
          const aValue = a[options.sortField!];
          const bValue = b[options.sortField!];
          
          if (aValue < bValue) return options.sortDirection === 'asc' ? -1 : 1;
          if (aValue > bValue) return options.sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }
      
      // Apply limit if needed
      if (options?.limitTo && options.limitTo > 0) {
        documents = documents.slice(0, options.limitTo);
      }
      
      return { docs: documents };
    } catch (error) {
      const firestoreError = error as FirestoreError;
      console.error(`Error searching documents with contains:`, firestoreError);
      setError(new Error(firestoreError.message));
      return { error: firestoreError };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    search,
    searchWithContains
  };
};
