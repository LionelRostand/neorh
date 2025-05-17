
import { DocumentData, Query, collection, getDocs, limit, orderBy, query, where, QueryConstraint, DocumentSnapshot, FirestoreError } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { showErrorToast } from "@/utils/toastUtils";

// Define interfaces for search options and results
export interface SearchOptions {
  limitTo?: number;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface SearchResult<T> {
  docs: Array<T & { id: string }>;
  count: number;
  lastDoc: DocumentSnapshot | null;
}

// Create search operations to find documents that match specific criteria
export const createSearchOperations = <T extends Record<string, any>>(
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<Error | null>>,
  getCollection: () => string
) => {
  
  /**
   * Search documents where field equals value
   * @param field The document field to search on
   * @param value The value to match
   * @param options Additional query options like limit
   * @returns Promise with results array
   */
  const search = async (
    field: string,
    value: any,
    options?: SearchOptions
  ): Promise<SearchResult<T>> => {
    try {
      setIsLoading(true);
      
      // Get the collection path as a string
      const collectionPath = getCollection();
      if (!collectionPath) {
        throw new Error('Invalid collection path: empty string');
      }
      
      console.log('Search in collection path:', collectionPath);
      
      // Create a collection reference using the path string
      const collectionRef = collection(db, collectionPath);
      
      // Start building the query with the where clause
      // Modifié: Utiliser l'opérateur d'égalité "==" au lieu de "in"
      const constraints: QueryConstraint[] = [where(field, "==", value)];
      
      // Add ordering if specified - only if explicitly requested
      // to avoid Firebase index errors
      if (options?.orderByField) {
        console.log(`Adding orderBy constraint: ${options.orderByField}, ${options.orderDirection || 'asc'}`);
        constraints.push(
          orderBy(options.orderByField, options.orderDirection || 'asc')
        );
      }
      
      // Add limit if specified
      if (options?.limitTo && options.limitTo > 0) {
        constraints.push(limit(options.limitTo));
      }
      
      // Create the query with all constraints
      const q = query(collectionRef, ...constraints);
      
      try {
        const querySnapshot = await getDocs(q);
        const docs = [] as Array<T & { id: string }>;
        
        // Parse documents and add to results array
        querySnapshot.forEach((doc) => {
          // Extract document data safely
          const data = doc.data() as T;
          docs.push({ 
            id: doc.id, 
            ...data 
          });
        });
        
        console.log(`Search results for ${field}=${value} in ${collectionPath}:`, docs.length);
        
        return {
          docs,
          count: docs.length,
          lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
        };
      } catch (firestoreError) {
        const error = firestoreError as FirestoreError;
        console.error('Firebase query error:', error);
        
        // Check specifically if it's an index error
        if (error.code === 'failed-precondition' && error.message.includes('index')) {
          console.warn('Index error detected, trying fallback query');
          
          // Try a simpler query without sorting
          const simpleQuery = query(collectionRef, where(field, "==", value));
          const fallbackSnapshot = await getDocs(simpleQuery);
          const fallbackDocs = [] as Array<T & { id: string }>;
          
          fallbackSnapshot.forEach((doc) => {
            // Extract document data safely
            const data = doc.data() as T;
            fallbackDocs.push({ 
              id: doc.id, 
              ...data 
            });
          });
          
          console.log(`Fallback search returned ${fallbackDocs.length} results`);
          
          return {
            docs: fallbackDocs,
            count: fallbackDocs.length,
            lastDoc: fallbackSnapshot.docs[fallbackSnapshot.docs.length - 1] || null
          };
        }
        
        // If it's not an index error or the fallback fails, throw the error
        throw firestoreError;
      }
      
    } catch (err) {
      console.error('Search operation error:', err);
      const error = err instanceof Error ? err : new Error('Unknown search error');
      setError(error);
      
      // User-friendly error messages
      if (error.message.includes('index')) {
        showErrorToast(`La recherche nécessite un index Firebase. Veuillez contacter l'administrateur.`);
      } else {
        showErrorToast(`Erreur de recherche: ${error.message}`);
      }
      
      // Return empty result on error instead of throwing
      return {
        docs: [],
        count: 0,
        lastDoc: null
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    search
  };
};
