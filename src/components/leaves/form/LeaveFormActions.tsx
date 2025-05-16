
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface LeaveFormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
}

export function LeaveFormActions({ onCancel, isSubmitting }: LeaveFormActionsProps) {
  return (
    <DialogFooter className="sm:justify-end">
      <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
        Annuler
      </Button>
      <Button 
        type="submit" 
        className="bg-emerald-500 hover:bg-emerald-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Attribution..." : "Attribuer la demande"}
      </Button>
    </DialogFooter>
  );
}
