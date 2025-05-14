
import { useFirestore } from '@/hooks/useFirestore';
import { CollectionTypes } from '@/lib/constants';

/**
 * Hook qui retourne la collection Firestore spécifiée
 * @param collectionName Nom de la collection à utiliser (optionnel)
 */
export function useCollection<T extends keyof CollectionTypes = any>(collectionName?: string) {
  // Si un nom de collection est fourni, l'utiliser directement
  // sinon utiliser une collection vide pour éviter les erreurs
  const collection = useFirestore<CollectionTypes[T]>(collectionName || '');
  
  return {
    ...collection,
    collectionName
  };
}
