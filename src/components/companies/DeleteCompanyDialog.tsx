
import React from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import useFirestore from "@/hooks/useFirestore";
import { Loader2 } from "lucide-react";

interface DeleteCompanyDialogProps {
  companyId: string;
  companyName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const DeleteCompanyDialog = ({
  companyId,
  companyName,
  open,
  onOpenChange,
  onSuccess
}: DeleteCompanyDialogProps) => {
  const { remove, isLoading } = useFirestore("hr_companies");

  const handleDelete = async () => {
    try {
      await remove(companyId);
      toast({
        title: "Suppression réussie",
        description: `L'entreprise ${companyName} a été supprimée`
      });
      if (onSuccess) {
        onSuccess();
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'entreprise",
        variant: "destructive"
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette entreprise ?</AlertDialogTitle>
          <AlertDialogDescription>
            Vous êtes sur le point de supprimer l'entreprise <span className="font-medium">{companyName}</span>.
            Cette action est irréversible et toutes les données associées à cette entreprise seront perdues.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault(); // Prevent default to handle deletion manually
              handleDelete();
            }} 
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression en cours...
              </>
            ) : (
              "Supprimer"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCompanyDialog;
