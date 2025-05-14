
import { 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  DocumentData
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/components/ui/use-toast";

// Write operations for Firestore
export const createWriteOperations = <T extends Record<string, any>>(
  collectionName: string,
  setIsLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void,
  getCollection: () => any
) => {
  // Ajouter un nouveau document
  const add = async (data: Omit<T, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const collectionRef = getCollection();
      const docRef = await addDoc(collectionRef, data as DocumentData);
      toast({
        title: "Succès",
        description: "Document ajouté avec succès",
      });
      return { id: docRef.id, ...data } as T & { id: string };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Une erreur est survenue");
      setError(error);
      toast({
        title: "Erreur",
        description: `Impossible d'ajouter le document: ${error.message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour un document
  const update = async (id: string, data: Partial<T>) => {
    setIsLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data as DocumentData);
      toast({
        title: "Succès",
        description: "Document mis à jour avec succès",
      });
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Une erreur est survenue");
      setError(error);
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour le document: ${error.message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un document
  const remove = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast({
        title: "Succès",
        description: "Document supprimé avec succès",
      });
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Une erreur est survenue");
      setError(error);
      toast({
        title: "Erreur",
        description: `Impossible de supprimer le document: ${error.message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    add,
    update,
    remove
  };
};
