
import { useState } from 'react';
import useFirestore from '@/hooks/useFirestore';

// Wrapper pour maintenir la compatibilité avec l'ancien code
export const useCollection = <T extends { collection: string }>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Déterminer la collection en fonction du type générique T
  const getCollectionName = () => {
    // Utiliser un nom de collection par défaut si T ne contient pas de propriété 'collection'
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

  return {
    getAll,
    isLoading,
    error
  };
};

export default useCollection;
