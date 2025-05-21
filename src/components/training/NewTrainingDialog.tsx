
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NewTrainingForm from "./NewTrainingForm";

interface NewTrainingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const NewTrainingDialog = ({ open, onOpenChange, onSuccess }: NewTrainingDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle formation</DialogTitle>
          <p className="text-sm text-gray-500">
            Remplissez les informations pour créer une nouvelle formation.
          </p>
        </DialogHeader>
        
        <NewTrainingForm 
          onCancel={() => onOpenChange(false)} 
          onSuccess={() => {
            onOpenChange(false);
            if (onSuccess) onSuccess();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewTrainingDialog;
