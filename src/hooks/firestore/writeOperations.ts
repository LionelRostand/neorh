
import { 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  DocumentData,
  DocumentReference
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
  const add = async (data: Omit<T, 'id'>): Promise<{ id: string } & Omit<T, 'id'> | null> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Ajout d'un document dans ${collectionName}:`, data);
      const collectionRef = getCollection();
      
      // Utilisation de addDoc et await pour obtenir une référence valide
      const docRef = await addDoc(collectionRef, data as DocumentData);
      
      // Vérification de la référence et de l'ID
      if (!docRef) {
        throw new Error("La référence du document n'a pas été créée");
      }
      
      console.log(`Document ajouté avec succès, ID: ${docRef.id}`);
      
      toast({
        title: "Succès",
        description: "Document ajouté avec succès",
      });
      
      // Return the document with its ID
      return { id: docRef.id, ...data } as { id: string } & Omit<T, 'id'>;
    } catch (err) {
      console.error(`Erreur lors de l'ajout du document:`, err);
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
