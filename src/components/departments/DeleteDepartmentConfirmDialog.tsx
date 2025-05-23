
import React from 'react';
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
import { useFirestore } from '@/hooks/useFirestore';
import { Department } from '@/types/firebase';
import { HR } from '@/lib/constants/collections';

interface DeleteDepartmentConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onSuccess?: () => void;
}

const DeleteDepartmentConfirmDialog: React.FC<DeleteDepartmentConfirmDialogProps> = ({
  open,
  onOpenChange,
  department,
  onSuccess
}) => {
  const { remove, isLoading } = useFirestore<Department>(HR.DEPARTMENTS);

  const handleDelete = async () => {
    if (!department?.id) return;
    
    try {
      const success = await remove(department.id);
      
      if (success && onSuccess) {
        onSuccess();
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce département ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Les informations de {department?.name || 'ce département'} seront définitivement supprimées.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDepartmentConfirmDialog;
