
import { useState } from 'react';
import { 
  collection, 
  getDocs, 
  query, 
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QuerySnapshot,
  WhereFilterOp,
  OrderByDirection,
  QueryDocumentSnapshot,
  QueryConstraint,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { QueryParams, QueryResult } from '@/types/firebase';

// Type for search options
export interface SearchOptions {
  exactMatch?: boolean;
  caseInsensitive?: boolean;
  sortField?: string;
  sortDirection?: OrderByDirection;
  limitCount?: number;
  startAfterDoc?: DocumentSnapshot;
  additionalQueryParams?: QueryParams[];
}

// Create search operations with correct typing
export const createSearchOperations = <T extends Record<string, any>>(
  setIsLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void,
  getCollection: () => ReturnType<typeof collection>
) => {
  
  // Search function to find documents by field value
  const search = async (
    field: string,
    value: any,
    options: SearchOptions = {}
  ): Promise<QueryResult<T>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const collectionName = getCollection().id;
      
      // Create a query with all necessary constraints
      const queryConstraints: QueryConstraint[] = [];
      
      // Add field filter constraint
      queryConstraints.push(where(field, '==', value));
      
      // Add additional query params if provided
      if (options.additionalQueryParams) {
        options.additionalQueryParams.forEach(param => {
          queryConstraints.push(where(param.field, param.operator as WhereFilterOp, param.value));
        });
      }
      
      // Add sorting if provided
      if (options.sortField) {
        queryConstraints.push(orderBy(options.sortField, options.sortDirection || 'asc'));
      }
      
      // Add pagination if provided
      if (options.limitCount) {
        queryConstraints.push(limit(options.limitCount));
      }
      
      // Create and execute the query with all constraints
      const q = query(getCollection(), ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      // Transform the data with proper typing
      const docs = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        } as T & { id: string };
      });
      
      // Get the last document for pagination
      const lastDoc = querySnapshot.docs.length > 0 
        ? querySnapshot.docs[querySnapshot.docs.length - 1] 
        : null;
      
      // Return the result with proper structure
      return {
        docs,
        lastDoc,
        count: querySnapshot.docs.length
      };
      
    } catch (error) {
      console.error(`Error searching documents in ${getCollection().id}:`, error);
      setError(error instanceof Error ? error : new Error('An unknown error occurred during search'));
      return {
        docs: [],
        lastDoc: null,
        count: 0
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Return all search related functions
  return {
    search
  };
};
