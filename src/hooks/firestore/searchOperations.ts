
import { 
  query, 
  where, 
  orderBy,
  getDocs,
  QueryConstraint
} from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";

// Search operations for Firestore
export const createSearchOperations = <T extends Record<string, any>>(
  setIsLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void,
  getCollection: () => any
) => {
  // Recherche avec filtres
  const search = async (
    filters: Array<{ field: string; operator: "==" | "!=" | ">" | ">=" | "<" | "<="; value: any }>,
    sortField?: string,
    sortDirection?: "asc" | "desc"
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const collectionRef = getCollection();
      
      // Création des contraintes de requête
      const constraints: QueryConstraint[] = [];
      
      // Ajout des filtres
      filters.forEach(filter => {
        constraints.push(where(filter.field, filter.operator, filter.value));
      });
      
      // Ajout du tri si spécifié
      if (sortField) {
        constraints.push(orderBy(sortField, sortDirection || "asc"));
      }
      
      // Construction de la requête
      const q = constraints.length > 0 
        ? query(collectionRef, ...constraints)
        : query(collectionRef);
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as (T & { id: string })[];
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Une erreur est survenue");
      setError(error);
      toast({
        title: "Erreur",
        description: `Erreur lors de la recherche: ${error.message}`,
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { search };
};
