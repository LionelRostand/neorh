
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel?: () => void;
  isSubmitting: boolean;
  isEdit?: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isSubmitting,
  isEdit = false
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (isEdit ? "Mise à jour..." : "Création...") : (isEdit ? "Mettre à jour" : "Créer le projet")}
      </Button>
    </div>
  );
};
