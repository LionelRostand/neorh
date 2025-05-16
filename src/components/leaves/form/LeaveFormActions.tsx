
import React from "react";
import { Button } from "@/components/ui/button";

interface LeaveFormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

export function LeaveFormActions({ 
  onCancel, 
  isSubmitting, 
  submitLabel = "Soumettre la demande"
}: LeaveFormActionsProps) {
  return (
    <div className="flex justify-end gap-3 mt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Annuler
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Traitement en cours..." : submitLabel}
      </Button>
    </div>
  );
}
