
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
      constraints.push(where(field, "==", value));
      
      // Add sorting if specified
      if (options?.sortField) {
        const sortDirection: OrderByDirection = options.sortDirection || 'asc';
        constraints.push(orderBy(options.sortField, sortDirection));
      }
      
      // Create and execute query based on number of constraints
      let querySnapshot;
      
      // Explicitly handle different numbers of constraints to avoid spread operator
      if (constraints.length === 0) {
        querySnapshot = await getDocs(query(collectionRef));
      } else if (constraints.length === 1) {
        querySnapshot = await getDocs(query(collectionRef, constraints[0]));
      } else if (constraints.length === 2) {
        querySnapshot = await getDocs(query(collectionRef, constraints[0], constraints[1]));
      } else {
        // For more than 2 constraints, we need a composite index in Firebase
        console.warn('Warning: Search with sorting requires a composite index in Firebase.');
        
        // Use only the first constraint (where) without sorting to avoid composite index error
        querySnapshot = await getDocs(query(collectionRef, constraints[0]));
        
        if (options?.sortField) {
          toast({
            title: "Recherche",
            description: "La recherche avec tri nécessite un index composite. Le tri a été désactivé.",
            variant: "destructive"
          });
        }
      }
      
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
