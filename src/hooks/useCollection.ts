
import { useState } from 'react';
import { useFirestore } from './firestore';

// Type that allows both string and { collection: string } for backward compatibility
type CollectionInput = string | { collection: string };

// Wrapper pour maintenir la compatibilité avec l'ancien code
export const useCollection = <T extends CollectionInput>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Déterminer la collection en fonction du type générique T
  const getCollectionName = () => {
    // Handle both string and object with collection property
    if (typeof T === 'string') {
      return T;
    } else if (typeof T === 'object' && T && 'collection' in T) {
      return T.collection;
    }
    // Fallback to a default collection
    return 'hr_collections';
  };

  // Utiliser le hook useFirestore moderne
  const firestore = useFirestore<any>(getCollectionName());

  // Exposer les méthodes compatibles avec l'ancien hook
  const getAll = async () => {
    setIsLoading(true);
    try {
      const result = await firestore.getAll();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erreur lors de la récupération des documents");
      setError(error);
      return { docs: [] };
    } finally {
      setIsLoading(false);
    }
  };

  // Forward all the methods from firestore
  const add = async (data: any) => {
    setIsLoading(true);
    try {
      return await firestore.add(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erreur lors de l'ajout du document");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (id: string, data: any) => {
    setIsLoading(true);
    try {
      return await firestore.update(id, data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erreur lors de la mise à jour du document");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id: string) => {
    setIsLoading(true);
    try {
      return await firestore.remove(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erreur lors de la suppression du document");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const search = async (field: string, value: any) => {
    setIsLoading(true);
    try {
      return await firestore.search({ field, value });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erreur lors de la recherche de documents");
      setError(error);
      return { docs: [] };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getAll,
    isLoading,
    error,
    add,
    update,
    remove,
    search
  };
};

export default useCollection;
