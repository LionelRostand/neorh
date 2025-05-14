
import { 
  getDocs, 
  doc, 
  getDoc,
  DocumentData
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/components/ui/use-toast";

// Read operations for Firestore
export const createReadOperations = <T extends Record<string, any>>(
  collectionName: string,
  setIsLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void,
  getCollection: () => any
) => {
  // Récupérer tous les documents d'une collection
  const getAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(getCollection());
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

  return {
    getAll,
    getById
  };
};
