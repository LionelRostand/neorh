
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Calendar } from 'lucide-react';
import { AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ManagerActionsProps } from './types';

const ManagerActions: React.FC<ManagerActionsProps> = ({
  isEditing,
  isSaving,
  onCancel,
  setShowConfirmDialog,
  showConfirmDialog
}) => {
  if (isEditing) {
    return (
      <div className="flex w-full justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isSaving}
        >
          <X className="mr-1 h-4 w-4" />
          Annuler
        </Button>
        
        <AlertDialogTrigger asChild>
          <Button className="bg-emerald-500 hover:bg-emerald-600" disabled={isSaving}>
            <Check className="mr-1 h-4 w-4" />
            Enregistrer
          </Button>
        </AlertDialogTrigger>
      </div>
    );
  }
  
  return (
    <Button 
      variant="outline" 
      onClick={() => setShowConfirmDialog(true)}
      className="ml-auto"
    >
      <Calendar className="mr-1 h-4 w-4" />
      Modifier l'allocation
    </Button>
  );
};

export default ManagerActions;
