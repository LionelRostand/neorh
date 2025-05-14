
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit, startAfter, DocumentData, QueryConstraint, DocumentReference, Query, DocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { QueryParams, QueryResult } from '@/types/firebase';

// Helper function to get documents from a collection with optional query params
export const getDocs_firestore = async <T>({
  collectionName,
  queryParams = [],
  orderByField,
  orderByDirection = 'asc',
  limitCount,
  startAfterDoc,
}: {
  collectionName: string;
  queryParams?: QueryParams[];
  orderByField?: string;
  orderByDirection?: 'asc' | 'desc';
  limitCount?: number;
  startAfterDoc?: DocumentSnapshot;
}): Promise<QueryResult<T>> => {
  try {
    const collectionRef = collection(db, collectionName);
    
    // Build query constraints
    const constraints: QueryConstraint[] = [];
    
    // Add where clauses
    queryParams.forEach(param => {
      constraints.push(where(param.field, param.operator, param.value));
    });
    
    // Add orderBy if specified
    if (orderByField) {
      constraints.push(orderBy(orderByField, orderByDirection));
    }
    
    // Add limit if specified
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    
    // Create the query
    let q: Query = query(collectionRef, ...constraints);
    
    // Add startAfter if pagination is needed
    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }
    
    // Execute the query
    const querySnapshot = await getDocs(q);
    
    // Process the results
    const docs = querySnapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      } as T & { id: string };
    });
    
    // Return the results and last document for pagination
    return {
      docs,
      lastDoc: querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null,
      count: querySnapshot.size
    };
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

// Helper function to get a single document by ID
export const getDoc_firestore = async <T>(
  collectionName: string,
  docId: string
): Promise<T & { id: string } | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as T & { id: string };
    } else {
      console.log(`No document found with ID: ${docId}`);
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

// Create read operations for a collection
export const createReadOperations = <T extends Record<string, any>>(
  collectionName: string,
  setIsLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void,
  getCollection: () => any
) => {
  // Get all documents from the collection
  const getAll = async (options: {
    queryParams?: QueryParams[];
    orderByField?: string;
    orderByDirection?: 'asc' | 'desc';
    limitCount?: number;
    startAfterDoc?: DocumentSnapshot;
  } = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getDocs_firestore<T>({
        collectionName,
        ...options
      });
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Une erreur est survenue");
      setError(error);
      return { docs: [], lastDoc: null, count: 0 };
    } finally {
      setIsLoading(false);
    }
  };

  // Get a document by ID
  const getById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getDoc_firestore<T>(collectionName, id);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Une erreur est survenue");
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getAll,
    getById
  };
};
