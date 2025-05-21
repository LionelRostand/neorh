
import { useState } from 'react';
import { createReadOperations } from './readOperations';
import { createWriteOperations } from './writeOperations';
import { createSearchOperations } from './searchOperations';
import { useBaseFirestore } from './baseFirestore';

export const useFirestore = <T extends Record<string, any>>(collectionName: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const baseFirestore = useBaseFirestore<T>(collectionName);
  
  const readOperations = createReadOperations<T>(
    collectionName,
    setIsLoading,
    setError,
    baseFirestore.getCollection
  );
  
  const writeOperations = createWriteOperations<T>(
    collectionName,
    setIsLoading,
    setError
  );
  
  const searchOperations = createSearchOperations<T>(
    collectionName,
    setIsLoading,
    setError,
    baseFirestore.getCollection
  );
  
  return {
    ...readOperations,
    ...writeOperations,
    ...searchOperations,
    isLoading,
    error
  };
};

export { useFirestore as default };
