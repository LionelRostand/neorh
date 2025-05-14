
import { collection, CollectionReference } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Helper to get a strongly typed Firestore collection reference
 */
export const getCollection = <T extends Record<string, any>>(collectionName: string): CollectionReference<T> => {
  return collection(db, collectionName) as CollectionReference<T>;
};
