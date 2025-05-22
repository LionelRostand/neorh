
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel,
  isSubmitting = false 
}) => {
  return (
    <div className="flex justify-end space-x-2">
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Création en cours..." : "Créer le projet"}
      </Button>
    </div>
  );
};
