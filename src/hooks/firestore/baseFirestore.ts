
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection } from "firebase/firestore";

// Base hook that provides common functionality for Firestore operations
export const useBaseFirestore = <T extends Record<string, any>>(collectionName: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Helper to get collection path as a string
  const getCollection = () => {
    return collectionName;
  };

  return {
    getCollection,
    isLoading,
    setIsLoading,
    error,
    setError
  };
};
