
import { useState } from "react";
import { 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  DocumentData
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCollection } from "../collections";
import { handleFirestoreError, showSuccessToast } from "../errors";

/**
 * Write operations for Firestore
 */
export const useFirestoreWrite = <T extends Record<string, any>>(collectionName: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Ajouter un nouveau document
  const add = async (data: Omit<T, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const collRef = getCollection<T>(collectionName);
      const docRef = await addDoc(collRef, data as DocumentData);
      showSuccessToast("Document ajouté avec succès");
      return { id: docRef.id, ...data } as T & { id: string };
    } catch (err) {
      const error = handleFirestoreError(err, "Impossible d'ajouter le document");
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour un document
  const update = async (id: string, data: Partial<T>) => {
    setIsLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data as DocumentData);
      showSuccessToast("Document mis à jour avec succès");
      return true;
    } catch (err) {
      const error = handleFirestoreError(err, "Impossible de mettre à jour le document");
      setError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un document
  const remove = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, collectionName, id));
      showSuccessToast("Document supprimé avec succès");
      return true;
    } catch (err) {
      const error = handleFirestoreError(err, "Impossible de supprimer le document");
      setError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    add,
    update,
    remove,
    isLoading,
    error
  };
};
