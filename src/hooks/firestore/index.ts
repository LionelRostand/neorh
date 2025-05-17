
import { useBaseFirestore } from "./baseFirestore";
import { createReadOperations } from "./readOperations";
import { createWriteOperations } from "./writeOperations";
import { createSearchOperations, SearchOptions } from "./searchOperations";

// Export the SearchOptions interface with correct 'export type' syntax
export type { SearchOptions };

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
    getById,
    search,
    clearCache
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
    search: advancedSearch
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
    search,
    advancedSearch,
    clearCache
  };
};

// Export the main hook as default
export default useFirestore;
