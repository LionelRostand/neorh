
import { collection, query, where, orderBy, startAt, endAt, getDocs, QueryConstraint, limit, DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { QueryParams, QueryResult } from '@/types/firebase';

// Helper function for searching documents in a collection
export const searchDocs_firestore = async <T>({
  collectionName,
  searchField,
  searchTerm,
  exactMatch = false,
  caseSensitive = false,
  orderByField,
  orderByDirection = 'asc',
  limitCount,
  additionalQueryParams = []
}: {
  collectionName: string;
  searchField: string;
  searchTerm: string;
  exactMatch?: boolean;
  caseSensitive?: boolean;
  orderByField?: string;
  orderByDirection?: 'asc' | 'desc';
  limitCount?: number;
  additionalQueryParams?: { field: string; operator: any; value: any }[];
}): Promise<QueryResult<T>> => {
  try {
    const collectionRef = collection(db, collectionName);
    const constraints: QueryConstraint[] = [];
    
    // Handle additional query params
    additionalQueryParams.forEach(param => {
      constraints.push(where(param.field, param.operator, param.value));
    });
    
    // For search functionality
    if (searchTerm && searchField) {
      // Use the field specified for searching
      const fieldToOrderBy = orderByField || searchField;
      constraints.push(orderBy(fieldToOrderBy));
      
      if (exactMatch) {
        // Exact match search
        constraints.push(where(searchField, '==', searchTerm));
      } else {
        // Partial match search
        const processedSearchTerm = caseSensitive ? searchTerm : searchTerm.toLowerCase();
        const endSearchTerm = processedSearchTerm + '\uf8ff'; // Unicode character after all ASCII chars
        
        constraints.push(startAt(processedSearchTerm));
        constraints.push(endAt(endSearchTerm));
      }
    } else if (orderByField) {
      // If no search but ordering is required
      constraints.push(orderBy(orderByField, orderByDirection));
    }
    
    // Add limit if specified
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    
    // Create and execute the query
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    // Process the results
    const docs = querySnapshot.docs.map(doc => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        ...data
      } as T & { id: string };
    });
    
    // Return the results
    return {
      docs,
      lastDoc: querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null,
      count: querySnapshot.size
    };
  } catch (error) {
    console.error('Error searching documents:', error);
    throw error;
  }
};

// Create search operations for a collection
export const createSearchOperations = <T extends Record<string, any>>(
  setIsLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void,
  getCollection: () => any
) => {
  // Search documents in the collection
  const search = async (
    field: string,
    value: any,
    options: {
      exactMatch?: boolean;
      caseSensitive?: boolean;
      orderByField?: string;
      orderByDirection?: 'asc' | 'desc';
      limitCount?: number;
      additionalQueryParams?: QueryParams[];
    } = {}
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const collectionRef = getCollection();
      
      // Create a query with all necessary constraints
      const queryConstraints: QueryConstraint[] = [];
      
      // Add field filter constraint
      queryConstraints.push(where(field, '==', value));
      
      // Add additional query params if provided
      if (options.additionalQueryParams) {
        options.additionalQueryParams.forEach(param => {
          queryConstraints.push(where(param.field, param.operator, param.value));
        });
      }
      
      // Add ordering if specified
      if (options.orderByField) {
        queryConstraints.push(orderBy(options.orderByField, options.orderByDirection || 'asc'));
      }
      
      // Add limit if specified
      if (options.limitCount) {
        queryConstraints.push(limit(options.limitCount));
      }
      
      // Create and execute the query with all constraints - Fixed spreading issue
      const q = query(collectionRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      // Process the results
      const docs = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        } as T & { id: string };
      });
      
      return {
        docs,
        lastDoc: querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null,
        count: querySnapshot.size
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Une erreur est survenue");
      setError(error);
      return { docs: [], lastDoc: null, count: 0 };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    search
  };
};
