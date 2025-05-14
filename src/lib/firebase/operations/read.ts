
import { useState } from "react";
import { 
  getDocs, 
  doc, 
  getDoc, 
  query,
  where,
  orderBy,
  QueryConstraint
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCollection } from "../collections";
import { handleFirestoreError } from "../errors";
import { FirestoreFilter, FirestoreSortDirection } from "../types";

/**
 * Read operations for Firestore
 */
export const useFirestoreRead = <T extends Record<string, any>>(collectionName: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Récupérer tous les documents d'une collection
  const getAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const collRef = getCollection<T>(collectionName);
      const querySnapshot = await getDocs(collRef);
      const data = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as (T & { id: string })[];
      
      return data;
    } catch (err) {
      const error = handleFirestoreError(err, "Impossible de récupérer les données");
      setError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer un document par son ID
  const getById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
      } else {
        return null;
      }
    } catch (err) {
      const error = handleFirestoreError(err, "Impossible de récupérer le document");
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Recherche avec filtres
  const search = async (
    filters: FirestoreFilter[],
    sortField?: string,
    sortDirection?: FirestoreSortDirection
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const collRef = getCollection<T>(collectionName);
      
      // Création des contraintes de requête
      const constraints: QueryConstraint[] = [];
      
      // Ajout des filtres
      filters.forEach(filter => {
        constraints.push(where(filter.field, filter.operator, filter.value));
      });
      
      // Ajout du tri si spécifié
      if (sortField) {
        constraints.push(orderBy(sortField, sortDirection || "asc"));
      }
      
      // Construction de la requête
      const q = constraints.length > 0 
        ? query(collRef, ...constraints)
        : query(collRef);
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as (T & { id: string })[];
    } catch (err) {
      const error = handleFirestoreError(err, "Erreur lors de la recherche");
      setError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getAll,
    getById,
    search,
    isLoading,
    error
  };
};
