
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
      
      // Create the query with explicit constraint handling
      let q;
      
      // Handle each case separately without using spread operator
      if (constraints.length === 0) {
        q = query(collectionRef);
      } else if (constraints.length === 1) {
        q = query(collectionRef, constraints[0]);
      } else if (constraints.length === 2) {
        q = query(collectionRef, constraints[0], constraints[1]);
      } else {
        // For more than 2 constraints, we need to handle them individually
        // Note: This is a simplification, in a real-world scenario, you'd need to create a composite index in Firebase
        q = query(collectionRef, constraints[0], constraints[1]);
        console.warn('Search only supports up to 2 constraints. Additional constraints were ignored.');
      }
      
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
