
import { toast } from "@/components/ui/use-toast";

/**
 * Handles Firestore errors in a consistent way
 */
export const handleFirestoreError = (err: unknown, operation: string): Error => {
  const error = err instanceof Error ? err : new Error("Une erreur est survenue");
  
  toast({
    title: "Erreur",
    description: `${operation}: ${error.message}`,
    variant: "destructive"
  });
  
  return error;
};

/**
 * Shows a success toast message
 */
export const showSuccessToast = (message: string) => {
  toast({
    title: "Succès",
    description: message,
  });
};
