
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EmployeeForm } from "./EmployeeForm";

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddEmployeeDialog({ 
  open, 
  onOpenChange,
  onSuccess 
}: AddEmployeeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <EmployeeForm 
          onClose={() => onOpenChange(false)}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
