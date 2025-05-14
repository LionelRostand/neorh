
import { useState } from "react";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/components/ui/use-toast";

export const useFirestore = <T extends Record<string, any>>(collectionName: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Récupérer tous les documents d'une collection
  const getAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const data = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as (T & { id: string })[];
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Une erreur est survenue");
      setError(error);
      toast({
        title: "Erreur",
        description: `Impossible de récupérer les données: ${error.message}`,
        variant: "destructive"
      });
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
      const error = err instanceof Error ? err : new Error("Une erreur est survenue");
      setError(error);
      toast({
        title: "Erreur",
        description: `Impossible de récupérer le document: ${error.message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter un nouveau document
  const add = async (data: Omit<T, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      toast({
        title: "Succès",
        description: "Document ajouté avec succès",
      });
      return { id: docRef.id, ...data } as T & { id: string };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Une erreur est survenue");
      setError(error);
      toast({
        title: "Erreur",
        description: `Impossible d'ajouter le document: ${error.message}`,
        variant: "destructive"
      });
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
      await updateDoc(docRef, data);
      toast({
        title: "Succès",
        description: "Document mis à jour avec succès",
      });
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Une erreur est survenue");
      setError(error);
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour le document: ${error.message}`,
        variant: "destructive"
      });
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
      toast({
        title: "Succès",
        description: "Document supprimé avec succès",
      });
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Une erreur est survenue");
      setError(error);
      toast({
        title: "Erreur",
        description: `Impossible de supprimer le document: ${error.message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Recherche avec filtres
  const search = async (
    filters: Array<{ field: string; operator: "==" | "!=" | ">" | ">=" | "<" | "<="; value: any }>,
    sortField?: string,
    sortDirection?: "asc" | "desc"
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      let q = collection(db, collectionName);
      
      // Application des filtres
      if (filters.length > 0) {
        const conditions = filters.map(filter => 
          where(filter.field, filter.operator, filter.value)
        );
        
        // Créez une requête avec tous les filtres
        q = query(q, ...conditions);
      }
      
      // Application du tri si spécifié
      if (sortField) {
        q = query(q, orderBy(sortField, sortDirection || "asc"));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as (T & { id: string })[];
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Une erreur est survenue");
      setError(error);
      toast({
        title: "Erreur",
        description: `Erreur lors de la recherche: ${error.message}`,
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getAll,
    getById,
    add,
    update,
    remove,
    search,
    isLoading,
    error
  };
};
