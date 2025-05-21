
import { getDocs, getDoc, doc, collection, query, where, orderBy, limit, DocumentData, CollectionReference, FirestoreError } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ReadOperationsResult<T> {
  docs?: T[];
  error?: Error;
}

export const createReadOperations = <T extends Record<string, any>>(
  collectionName: string,
  setIsLoading: (value: boolean) => void,
  setError: (value: Error | null) => void,
  getCollection: () => CollectionReference<T>
) => {
  /**
   * Get all documents from a collection
   */
  const getAll = async (): Promise<ReadOperationsResult<T>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.info(`Getting all documents from ${collectionName}`);
      const querySnapshot = await getDocs(getCollection());
      const documents: T[] = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ ...doc.data(), id: doc.id } as T);
      });
      
      console.info(`Retrieved ${documents.length} documents from ${collectionName}`);
      return { docs: documents };
    } catch (error) {
      const firestoreError = error as FirestoreError;
      console.error(`Error getting documents from ${collectionName}:`, firestoreError);
      setError(new Error(firestoreError.message));
      return { error: firestoreError };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get a document by ID
   */
  const getById = async (id: string): Promise<ReadOperationsResult<T>> => {
    if (!id) {
      console.warn("getById called with empty ID");
      return { error: new Error("Document ID is required") };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, collectionName, id);
      const docSnapshot = await getDoc(docRef);
      
      if (docSnapshot.exists()) {
        // Get document data and explicitly cast to unknown first before casting to T
        const documentData = docSnapshot.data();
        
        // Create the complete document with id and data
        const document = {
          ...documentData,
          id: docSnapshot.id
        } as unknown as T;
        
        return { docs: [document] };
      } else {
        console.warn(`No document found with ID: ${id}`);
        return { docs: [] };
      }
    } catch (error) {
      const firestoreError = error as FirestoreError;
      console.error(`Error getting document ${id}:`, firestoreError);
      setError(new Error(firestoreError.message));
      return { error: firestoreError };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get documents with filtering and sorting
   */
  const getFiltered = async (
    field: string,
    value: any,
    options?: { 
      sortField?: string;
      sortDirection?: 'asc' | 'desc';
      limitTo?: number;
    }
  ): Promise<ReadOperationsResult<T>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      let q = query(getCollection(), where(field, '==', value));
      
      if (options?.sortField) {
        q = query(q, orderBy(options.sortField, options.sortDirection || 'asc'));
      }
      
      if (options?.limitTo) {
        q = query(q, limit(options.limitTo));
      }
      
      const querySnapshot = await getDocs(q);
      const documents: T[] = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ ...doc.data(), id: doc.id } as unknown as T);
      });
      
      return { docs: documents };
    } catch (error) {
      const firestoreError = error as FirestoreError;
      console.error(`Error getting filtered documents:`, firestoreError);
      setError(new Error(firestoreError.message));
      return { error: firestoreError };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getAll,
    getById,
    getFiltered
  };
};
