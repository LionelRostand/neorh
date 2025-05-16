
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LeaveFormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

export function LeaveFormActions({ onCancel, isSubmitting, submitLabel = "Soumettre la demande" }: LeaveFormActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Annuler
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
}
