
import { 
  doc, 
  getDocs, 
  getDoc,
  DocumentData,
  FirestoreError,
  Query,
  DocumentReference,
  CollectionReference
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/components/ui/use-toast";

// Read operations for Firestore
export const createReadOperations = <T extends Record<string, any>>(
  collectionName: string,
  setIsLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void,
  getCollection: () => CollectionReference<T>
) => {
  // Récupérer tous les documents
  const getAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Getting all documents from ${collectionName}`);
      const querySnapshot = await getDocs(getCollection());
      const documents = querySnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() as DocumentData } as T & { id: string };
      });
      console.log(`Retrieved ${documents.length} documents from ${collectionName}`);
      return { docs: documents };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Une erreur est survenue");
      console.error(`Error getting documents from ${collectionName}:`, error);
      setError(error);
      toast({
        title: "Erreur de récupération",
        description: `Impossible de récupérer les documents: ${error.message}`,
        variant: "destructive"
      });
      return { docs: [] };
    } finally {
      setIsLoading(false);
    }
  };

  // Cache pour éviter les requêtes répétées pour le même ID
  let cachedDocs: Record<string, { timestamp: number, data: (T & { id: string }) }> = {};
  const CACHE_TTL = 10000; // 10 secondes en millisecondes

  // Récupérer un document par son ID avec mise en cache
  const getById = async (id: string): Promise<(T & { id: string }) | null> => {
    // Ne pas modifier l'état de chargement si on sert depuis le cache
    const now = Date.now();
    const cachedDoc = cachedDocs[id];
    
    if (cachedDoc && (now - cachedDoc.timestamp < CACHE_TTL)) {
      console.info(`getDoc_firestore: Serving document ${id} from cache`);
      return cachedDoc.data;
    }
    
    setIsLoading(true);
    setError(null);
    
    console.info(`getDoc_firestore: Fetching document from ${collectionName} with ID: ${id}`);
    
    try {
      if (!id) {
        throw new Error("ID non fourni");
      }
      
      const docRef = doc(db, collectionName, id) as DocumentReference<T>;
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.info(`createReadOperations: Document found for ID ${id}`);
        const result = { id: docSnap.id, ...docSnap.data() as DocumentData } as T & { id: string };
        
        // Mettre en cache le résultat
        cachedDocs[id] = {
          timestamp: now,
          data: result
        };
        
        return result;
      } else {
        console.warn(`createReadOperations: Document with ID ${id} not found in ${collectionName}`);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof FirestoreError 
        ? `Erreur Firestore (${err.code}): ${err.message}` 
        : err instanceof Error 
          ? err.message 
          : "Erreur inconnue";
      
      console.error(`createReadOperations: Error getting document ${id} from ${collectionName}:`, err);
      
      const error = err instanceof Error ? err : new Error(errorMessage);
      setError(error);
      
      return null;
    } finally {
      console.info(`createReadOperations: Finished getting document with ID ${id}, setting isLoading to false`);
      setIsLoading(false);
    }
  };

  // Réinitialiser le cache
  const clearCache = () => {
    cachedDocs = {};
    console.info(`Cache cleared for ${collectionName}`);
  };

  return {
    getAll,
    getById,
    clearCache
  };
};
