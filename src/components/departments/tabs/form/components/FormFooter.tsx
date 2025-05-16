
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface FormFooterProps {
  isLoading: boolean;
  onCancel: () => void;
}

export const FormFooter: React.FC<FormFooterProps> = ({
  isLoading,
  onCancel,
}) => {
  return (
    <DialogFooter className="pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        <X className="h-4 w-4 mr-2" /> Annuler
      </Button>
      <Button 
        type="submit" 
        disabled={isLoading}
        className="bg-emerald-600 hover:bg-emerald-700"
      >
        <Check className="h-4 w-4 mr-2" /> Enregistrer
      </Button>
    </DialogFooter>
  );
};
