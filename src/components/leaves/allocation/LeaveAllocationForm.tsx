
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import LeaveAllocationFields from "./components/LeaveAllocationFields";
import LeaveAllocationFormActions from "./components/LeaveAllocationFormActions";
import { useLeaveAllocationForm } from "./hooks/useLeaveAllocationForm";

interface LeaveAllocationFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  employeeId?: string;
}

const LeaveAllocationForm: React.FC<LeaveAllocationFormProps> = ({
  open,
  onClose,
  onSuccess,
  employeeId,
}) => {
  const {
    form,
    isSubmitting,
    isLoading,
    handleSubmit
  } = useLeaveAllocationForm(employeeId, onSuccess, onClose);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle attribution de congé</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <LeaveAllocationFields 
              form={form} 
              employeeId={employeeId}
            />
            
            <LeaveAllocationFormActions 
              onCancel={onClose} 
              isSubmitting={isSubmitting} 
              isLoading={isLoading}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveAllocationForm;
