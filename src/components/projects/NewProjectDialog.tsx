
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectForm } from "./forms/ProjectForm";

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const NewProjectDialog: React.FC<NewProjectDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouveau Projet</DialogTitle>
        </DialogHeader>
        <ProjectForm 
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

export default NewProjectDialog;
