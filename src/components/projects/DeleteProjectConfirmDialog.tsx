
import React from 'react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Project } from '@/types/project';

interface DeleteProjectConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onSuccess?: () => void;
}

const DeleteProjectConfirmDialog: React.FC<DeleteProjectConfirmDialogProps> = ({
  open,
  onOpenChange,
  project,
  onSuccess
}) => {
  const handleDelete = async () => {
    // This would typically delete data via an API
    toast({
      title: "Fonctionnalité à venir",
      description: "La suppression de projets sera bientôt disponible."
    });
    onOpenChange(false);
    if (onSuccess) onSuccess();
  };

  if (!project) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Le projet "{project.name}" sera définitivement supprimé de notre système.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProjectConfirmDialog;
