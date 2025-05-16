
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Calendar } from 'lucide-react';

interface AllocationFooterProps {
  isEditing: boolean;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  canEdit: boolean;
}

const AllocationFooter: React.FC<AllocationFooterProps> = ({
  isEditing,
  isSaving,
  onSave,
  onCancel,
  canEdit
}) => {
  if (!canEdit) {
    return null;
  }

  if (!isEditing) {
    return null;
  }

  return (
    <CardFooter className="pt-0">
      <div className="flex w-full justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isSaving}
        >
          <X className="mr-1 h-4 w-4" />
          Annuler
        </Button>
        
        <Button 
          className="bg-emerald-500 hover:bg-emerald-600" 
          disabled={isSaving}
          onClick={onSave}
        >
          <Check className="mr-1 h-4 w-4" />
          Enregistrer
        </Button>
      </div>
    </CardFooter>
  );
};

export default AllocationFooter;
