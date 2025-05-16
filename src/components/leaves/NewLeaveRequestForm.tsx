
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLeaveRequestForm } from "./form/useLeaveRequestForm";
import { LeaveRequestFormContent } from "./form/LeaveRequestFormContent";

interface NewLeaveRequestFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  employeeId?: string;
  isAllocation?: boolean;
}

const NewLeaveRequestForm: React.FC<NewLeaveRequestFormProps> = ({ 
  open, 
  onClose, 
  onSuccess,
  employeeId,
  isAllocation = false
}) => {
  const {
    form,
    syncDaysAllocated,
    handleFormSubmit,
    isSubmitting,
    showPaidLeaveAllocation,
    showRttAllocation,
    getPaidLeaveAllocationLabel,
    getRttAllocationLabel,
    getPaidLeaveHelperText,
    getRttHelperText,
    getDialogTitle
  } = useLeaveRequestForm(onClose, onSuccess, employeeId, isAllocation);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>

        <LeaveRequestFormContent
          form={form}
          employeeId={employeeId}
          isAllocation={isAllocation}
          showPaidLeaveAllocation={showPaidLeaveAllocation}
          showRttAllocation={showRttAllocation}
          getPaidLeaveAllocationLabel={getPaidLeaveAllocationLabel}
          getRttAllocationLabel={getRttAllocationLabel}
          getPaidLeaveHelperText={getPaidLeaveHelperText}
          getRttHelperText={getRttHelperText}
          syncDaysAllocated={syncDaysAllocated}
          onSubmit={handleFormSubmit}
          onClose={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewLeaveRequestForm;
