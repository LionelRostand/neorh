
import React from "react";
import { Button } from "@/components/ui/button";

interface FormFooterProps {
  onCancel?: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

export default function FormFooter({
  onCancel,
  isSubmitting,
  submitLabel = "Enregistrer"
}: FormFooterProps) {
  return (
    <div className="flex justify-end space-x-2">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "En cours..." : submitLabel}
      </Button>
    </div>
  );
}
