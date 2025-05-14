
import { useState, useEffect } from "react";
import { useFirestoreRead } from "@/lib/firebase/operations/read";
import { useFirestoreWrite } from "@/lib/firebase/operations/write";
import { FirestoreFilter, FirestoreSortDirection } from "@/lib/firebase/types";

/**
 * Hook that combines read and write Firestore operations
 */
export const useFirestore = <T extends Record<string, any>>(collectionName: string) => {
  const { getAll, getById, search, isLoading: isReadLoading, error: readError } = useFirestoreRead<T>(collectionName);
  const { add, update, remove, isLoading: isWriteLoading, error: writeError } = useFirestoreWrite<T>(collectionName);

  // Combine loading and error states
  const isLoading = isReadLoading || isWriteLoading;
  
  // Prioritize the latest error
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (writeError) setError(writeError);
    else if (readError) setError(readError);
    else setError(null);
  }, [readError, writeError]);

  return {
    // Read operations
    getAll,
    getById,
    search,
    
    // Write operations
    add,
    update,
    remove,
    
    // Status
    isLoading,
    error
  };
};
