
import { useBaseFirestore } from "./baseFirestore";
import { createReadOperations } from "./readOperations";
import { createWriteOperations } from "./writeOperations";
import { createSearchOperations } from "./searchOperations";
import { CollectionReference, DocumentData } from "firebase/firestore";

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
    () => getCollection().path
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
    () => getCollection().path
  );

  // Get search operations
  const { 
    search 
  } = createSearchOperations<T>(
    setIsLoading, 
    setError, 
    () => getCollection().path
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
