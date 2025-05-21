
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NewEvaluationForm } from "./NewEvaluationForm";

interface NewEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const NewEvaluationDialog = ({
  open,
  onOpenChange,
  onSuccess
}: NewEvaluationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle évaluation</DialogTitle>
        </DialogHeader>
        <NewEvaluationForm onCancel={() => onOpenChange(false)} onSuccess={() => {
          onSuccess?.();
          onOpenChange(false);
        }} />
      </DialogContent>
    </Dialog>
  );
};
