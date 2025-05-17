
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onClose: () => void;
  canEdit: boolean;
  isSubmitting: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ onClose, canEdit, isSubmitting }) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose}
      >
        Annuler
      </Button>
      
      {canEdit && (
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      )}
    </div>
  );
};

export default FormActions;
