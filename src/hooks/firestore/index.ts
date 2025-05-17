
import { useBaseFirestore } from "./baseFirestore";
import { createReadOperations } from "./readOperations";
import { createWriteOperations } from "./writeOperations";
import { createSearchOperations, type SearchCriteria, type SearchOptions } from "./searchOperations";

// Main hook that combines all firestore operations
export const useFirestore = <T extends Record<string, any>>(collectionName: string) => {
  const { 
    getCollection, 
    isLoading, 
    setIsLoading, 
    error, 
    setError 
  } = useBaseFirestore<T>(collectionName);
  
  // Get read operations
  const { 
    getAll, 
    getById 
  } = createReadOperations<T>(
    collectionName, 
    setIsLoading, 
    setError, 
    getCollection
  );

  // Get write operations
  const { 
    add, 
    update, 
    remove 
  } = createWriteOperations<T>(
    collectionName, 
    setIsLoading, 
    setError, 
    getCollection
  );

  // Get search operations
  const { 
    search 
  } = createSearchOperations<T>(
    setIsLoading, 
    setError, 
    getCollection
  );

  return {
    // State
    isLoading,
    error,
    
    // Operations
    getAll,
    getById,
    add,
    update,
    remove,
    search
  };
};

// Export the main hook as default
export default useFirestore;

// Re-export types
export type { SearchCriteria, SearchOptions } from './searchOperations';
