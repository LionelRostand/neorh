
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ContractForm from "./form/ContractForm";
import useFirestore from "@/hooks/useFirestore";
import { toast } from "@/components/ui/use-toast";

interface NewContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function NewContractDialog({ 
  open, 
  onOpenChange,
  onSuccess
}: NewContractDialogProps) {
  
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouveau contrat</DialogTitle>
        </DialogHeader>
        <ContractForm 
          onCancel={handleCancel} 
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
