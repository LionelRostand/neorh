
import { useLocation } from 'react-router-dom';
import { useFirestore } from './useFirestore';
import { ROUTE_TO_COLLECTION_MAP, CollectionTypes } from '@/lib/constants';

/**
 * Hook qui retourne la collection Firestore correspondant à la route actuelle
 */
export function useCollection<T extends keyof CollectionTypes = any>() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Obtenir le nom de la collection correspondant à la route actuelle
  const collectionName = ROUTE_TO_COLLECTION_MAP[currentPath as keyof typeof ROUTE_TO_COLLECTION_MAP] || '';
  
  // Utiliser useFirestore avec la collection déterminée
  const collection = useFirestore<CollectionTypes[T]>(collectionName);
  
  return {
    ...collection,
    collectionName
  };
}

