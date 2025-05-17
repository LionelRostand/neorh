
import { DocumentData, Query, collection, getDocs, limit, orderBy, query, where, QueryConstraint } from "firebase/firestore";
import { db } from "@/lib/firebase";

type WhereFilterOp = '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in';

// Create search operations to find documents that match specific criteria
export const createSearchOperations = <T extends Record<string, any>>(
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<Error | null>>,
  getCollection: () => string
) => {
  
  /**
   * Search documents where field equals value
   * @param field The document field to search on
   * @param value The value to match
   * @param options Additional query options like limit
   * @returns Promise with results array
   */
  const search = async (
    field: string,
    value: any,
    options?: {
      limitTo?: number;
      orderByField?: string;
      orderDirection?: 'asc' | 'desc';
      sortField?: string;
      sortDirection?: 'asc' | 'desc';
    }
  ) => {
    try {
      setIsLoading(true);
      
      const collectionRef = collection(db, getCollection());
      
      // Start building the query with the where clause
      let constraints: QueryConstraint[] = [where(field, "==", value)];
      
      // Add ordering if specified
      if (options?.orderByField) {
        constraints.push(
          orderBy(options.orderByField, options.orderDirection || 'asc')
        );
      }
      
      // Add sorting if specified (for backward compatibility)
      if (options?.sortField) {
        constraints.push(
          orderBy(options.sortField, options.sortDirection || 'asc')
        );
      }
      
      // Add limit if specified
      if (options?.limitTo && options.limitTo > 0) {
        constraints.push(limit(options.limitTo));
      }
      
      // Create the query with all constraints
      const q = query(collectionRef, ...constraints);
      
      const querySnapshot = await getDocs(q);
      const docs = [] as Array<T & { id: string }>;
      
      // Parse documents and add to results array
      querySnapshot.forEach((doc) => {
        docs.push({ 
          id: doc.id, 
          ...doc.data() as T
        });
      });
      
      return {
        docs,
        count: docs.length,
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
      };
      
    } catch (err) {
      console.error('Search operation error:', err);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    search
  };
};
