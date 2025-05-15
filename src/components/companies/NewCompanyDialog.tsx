
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CompanyForm from "./form/CompanyForm";

interface NewCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const NewCompanyDialog = ({ open, onOpenChange, onSuccess }: NewCompanyDialogProps) => {
  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <CompanyForm 
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewCompanyDialog;
