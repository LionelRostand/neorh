
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
}

export const FormActions = ({ onCancel, isSubmitting }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Annuler
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Création en cours..." : "Créer"}
      </Button>
    </div>
  );
};
