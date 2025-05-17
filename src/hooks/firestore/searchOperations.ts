
import { 
  query, 
  where, 
  getDocs,
  DocumentData,
  QueryConstraint,
  Query,
  WhereFilterOp,
  collection,
  CollectionReference,
  orderBy
} from "firebase/firestore";

// Define type for search options
export interface SearchOptions {
  orderBy?: string;
  limit?: number;
  direction?: 'asc' | 'desc';
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface SearchCriteria {
  field: string;
  value: any;
  operator?: WhereFilterOp;
}

// Create search operations
export const createSearchOperations = <T extends Record<string, any>>(
  setIsLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void,
  getCollection: () => CollectionReference<T>
) => {
  // Search for documents based on a field value
  const search = async (criteria: SearchCriteria | string, value?: any, options?: SearchOptions) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Handle both new object format and old string/value format
      let field: string;
      let searchValue: any;
      let operator: WhereFilterOp = "==";
      let searchOptions: SearchOptions = {};
      
      // Determine which format is being used
      if (typeof criteria === 'object' && criteria !== null) {
        // New format with SearchCriteria object
        field = criteria.field;
        searchValue = criteria.value;
        if (criteria.operator) operator = criteria.operator;
        if (options) searchOptions = options;
      } else {
        // Old format with separate field and value
        field = criteria as string;
        searchValue = value;
        if (options) searchOptions = options;
      }

      console.log(`Searching in collection with criteria: ${field} ${operator} ${searchValue}`);
      
      // Create query constraints
      const constraints: QueryConstraint[] = [where(field, operator, searchValue)];
      
      // Add orderBy constraint if sortField or orderBy is specified
      if (searchOptions.sortField) {
        constraints.push(orderBy(searchOptions.sortField, searchOptions.sortDirection || 'asc'));
      } else if (searchOptions.orderBy) {
        constraints.push(orderBy(searchOptions.orderBy, searchOptions.direction || 'asc'));
      }
      
      // Apply the query
      const q: Query<T> = query(getCollection(), ...constraints);
      const querySnapshot = await getDocs(q);
      
      // Process the results
      const documents = querySnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() as DocumentData } as T & { id: string };
      });
      
      console.log(`Search found ${documents.length} documents matching ${field} ${operator} ${searchValue}`);
      
      return { docs: documents };
    } catch (err) {
      console.error('Search error:', err);
      const error = err instanceof Error ? err : new Error('Unknown search error');
      setError(error);
      return { docs: [] };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    search
  };
};
