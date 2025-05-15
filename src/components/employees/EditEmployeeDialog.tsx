
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Employee } from '@/types/employee';
import { EditEmployeeForm } from './edit-dialog/EditEmployeeForm';

interface EditEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSuccess?: () => void;
}

export const EditEmployeeDialog: React.FC<EditEmployeeDialogProps> = ({ 
  open, 
  onOpenChange,
  employee,
  onSuccess
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier les informations de l'employé</DialogTitle>
          <DialogDescription>
            Effectuez les modifications nécessaires puis cliquez sur Enregistrer.
          </DialogDescription>
        </DialogHeader>

        <EditEmployeeForm 
          employee={employee} 
          onClose={() => onOpenChange(false)} 
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeDialog;
