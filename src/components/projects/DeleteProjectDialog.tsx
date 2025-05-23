
import React from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/hooks/firestore";
import { Project } from "@/types/project";
import { HR } from "@/lib/constants/collections";

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onSuccess: () => void;
}

const DeleteProjectDialog: React.FC<DeleteProjectDialogProps> = ({
  open,
  onOpenChange,
  project,
  onSuccess,
}) => {
  const { toast } = useToast();
  const firestore = useFirestore<Project>(HR.PROJECTS);

  const handleDelete = async () => {
    if (!project?.id) return;

    try {
      await firestore.remove(project.id);
      
      toast({
        title: "Succès",
        description: "Le projet a été supprimé avec succès.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la suppression du projet:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du projet.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer le projet "{project?.name}" ?
            Cette action est irréversible et supprimera définitivement le projet de la base de données.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProjectDialog;
