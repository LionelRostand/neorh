
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  FirestoreError,
  DocumentData,
  orderBy
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/components/ui/use-toast";

// Export the SearchOptions interface for use in other files
export interface SearchOptions {
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
}

// Create advanced search operations
export const createSearchOperations = <T extends Record<string, any>>(
  setIsLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void,
  getCollection: () => any
) => {
  // Advanced search function with multiple criteria
  const search = async (criteria: Record<string, any>, options: SearchOptions = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Performing advanced search with criteria:", criteria);
      
      const collRef = getCollection();
      let q = collRef;
      
      // Add all criteria to the query
      Object.entries(criteria).forEach(([field, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          q = query(q, where(field, "==", value));
        }
      });
      
      // Add ordering if specified
      if (options.orderByField) {
        q = query(q, orderBy(options.orderByField, options.orderDirection || 'asc'));
      }
      
      const querySnapshot = await getDocs(q);
      
      const documents = querySnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() as DocumentData } as T & { id: string };
      });
      
      console.log(`Advanced search found ${documents.length} documents`);
      return { docs: documents };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Une erreur est survenue lors de la recherche avancée");
      console.error("Error in advanced search:", error);
      setError(error);
      
      toast({
        title: "Erreur de recherche",
        description: `Impossible d'effectuer la recherche avancée: ${error.message}`,
        variant: "destructive"
      });
      
      return { docs: [] };
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    search
  };
};
