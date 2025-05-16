
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, X, Loader2 } from 'lucide-react';

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
  if (!isEditing || !canEdit) return null;

  return (
    <CardFooter className="flex justify-end space-x-2 pt-4 border-t">
      <Button
        variant="default"
        onClick={onSave}
        disabled={isSaving}
        className="gap-1"
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Enregistrer
      </Button>
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isSaving}
        className="gap-1"
      >
        <X className="h-4 w-4" />
        Annuler
      </Button>
    </CardFooter>
  );
};

export default AllocationFooter;
