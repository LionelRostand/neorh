
import { 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  QueryOrderByConstraint,
  OrderByDirection,
  QueryConstraint,
  WhereFilterOp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/components/ui/use-toast";

export const createSearchOperations = <T extends Record<string, any>>(
  setIsLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void,
  getCollection: () => any
) => {
  // Search documents by field and value
  const search = async (
    field: string, 
    value: string | number | boolean,
    options?: {
      sortField?: string;
      sortDirection?: OrderByDirection;
    }
  ) => {
    setIsLoading(true);
    setError(null);
    
    console.log(`Searching with criteria: ${field} = ${value}`, options);
    
    try {
      const collectionRef = getCollection();
      const constraints: QueryConstraint[] = [];
      
      // Add field equality constraint
      constraints.push(where(field, "==" as WhereFilterOp, value));
      
      // Add sorting if specified
      if (options?.sortField) {
        const sortDirection: OrderByDirection = options.sortDirection || 'asc';
        constraints.push(orderBy(options.sortField, sortDirection));
      }
      
      // Build the query correctly by spreading the constraints array as individual arguments
      // Fix: Ensure constraints is an array and use apply to pass each constraint as separate arg
      const q = query(collectionRef, ...(constraints as QueryConstraint[]));
      const querySnapshot = await getDocs(q);
      
      const documents = querySnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() } as T & { id: string };
      });
      
      console.log(`Found ${documents.length} documents matching search criteria ${field} = ${value}`);
      
      return { docs: documents };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Une erreur est survenue lors de la recherche");
      console.error("Error during search operation:", error, "Field:", field, "Value:", value);
      setError(error);
      toast({
        title: "Erreur de recherche",
        description: `Impossible de rechercher les documents: ${error.message}`,
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
