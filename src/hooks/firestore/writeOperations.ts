
import { addDoc, updateDoc, deleteDoc, doc, FirestoreError, CollectionReference } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface WriteOperationsResult<T> {
  doc?: T;
  id?: string;
  error?: Error;
}

export const createWriteOperations = <T extends Record<string, any>>(
  collectionName: string,
  setIsLoading: (value: boolean) => void,
  setError: (value: Error | null) => void,
  getCollection: () => CollectionReference<T>
) => {
  /**
   * Add a new document to a collection
   */
  const add = async (data: Omit<T, 'id'>): Promise<WriteOperationsResult<T>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Ajout de la date de création si elle n'existe pas déjà
      const dataWithDates = {
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
      };
      
      const docRef = await addDoc(getCollection(), dataWithDates as any);
      
      return { 
        id: docRef.id,
        doc: { id: docRef.id, ...dataWithDates } as T 
      };
    } catch (error) {
      const firestoreError = error as FirestoreError;
      console.error(`Error adding document:`, firestoreError);
      setError(new Error(firestoreError.message));
      return { error: firestoreError };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update an existing document
   */
  const update = async (id: string, data: Partial<Omit<T, 'id'>>): Promise<WriteOperationsResult<T>> => {
    if (!id) {
      return { error: new Error("Document ID is required") };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Ajout de la date de mise à jour
      const dataWithDates = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, dataWithDates as any);
      
      return { 
        id,
        doc: { id, ...dataWithDates } as T 
      };
    } catch (error) {
      const firestoreError = error as FirestoreError;
      console.error(`Error updating document:`, firestoreError);
      setError(new Error(firestoreError.message));
      return { error: firestoreError };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a document
   */
  const remove = async (id: string): Promise<WriteOperationsResult<T>> => {
    if (!id) {
      return { error: new Error("Document ID is required") };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      
      return { id };
    } catch (error) {
      const firestoreError = error as FirestoreError;
      console.error(`Error deleting document:`, firestoreError);
      setError(new Error(firestoreError.message));
      return { error: firestoreError };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    add,
    update,
    remove
  };
};
