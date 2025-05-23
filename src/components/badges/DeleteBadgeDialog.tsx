
import React from "react";
import { useFirestore } from "@/hooks/useFirestore";
import { Badge } from "@/types/firebase";
import { toast } from "@/components/ui/use-toast";
import { HR } from "@/lib/constants/collections";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteBadgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badge: Badge | null;
  onSuccess: () => void;
}

export function DeleteBadgeDialog({
  open,
  onOpenChange,
  badge,
  onSuccess,
}: DeleteBadgeDialogProps) {
  // Using the HR.BADGES constant for collection name
  const { remove, isLoading } = useFirestore<Badge>(HR.BADGES);

  const handleDelete = async () => {
    if (!badge?.id) return;
    
    try {
      await remove(badge.id);
      toast({
        title: "Badge supprimé",
        description: "Le badge a été supprimé avec succès",
      });
      
      // Fermer le dialogue et rafraîchir les données
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la suppression du badge:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du badge",
        variant: "destructive",
      });
    }
  };

  if (!badge) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer le badge <strong>{badge.number}</strong> attribué à <strong>{badge.employeeName}</strong> ? Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isLoading} 
            className="bg-red-500 hover:bg-red-600"
          >
            {isLoading ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
