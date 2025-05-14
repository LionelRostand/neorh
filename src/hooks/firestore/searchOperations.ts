
import { collection, query, where, orderBy, startAt, endAt, getDocs, QueryConstraint, limit, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { QueryResult } from '@/types/firebase';

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
