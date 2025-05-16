
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
import { useEmployeeDelete } from '@/hooks/employee/useEmployeeDelete';
import { Employee } from '@/types/employee';

interface DeleteEmployeeConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSuccess?: () => void;
}

const DeleteEmployeeConfirmDialog: React.FC<DeleteEmployeeConfirmDialogProps> = ({
  open,
  onOpenChange,
  employee,
  onSuccess
}) => {
  const { deleteEmployee, isProcessing } = useEmployeeDelete();

  const handleDelete = async () => {
    if (!employee?.id) return;
    
    try {
      const success = await deleteEmployee(employee.id);
      
      if (success) {
        if (onSuccess) onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet employé ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Les informations de {employee?.name} seront définitivement supprimées.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={isProcessing}
            className="bg-red-600 hover:bg-red-700"
          >
            {isProcessing ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteEmployeeConfirmDialog;
