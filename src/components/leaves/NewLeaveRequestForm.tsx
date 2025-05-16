
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLeaveRequestForm } from "./form/hooks/useLeaveRequestForm";
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
    handleSubmit,
    isSubmitting,
    selectedType,
    handleTypeChange,
    showPaidLeaveAllocation,
    showRttAllocation,
    syncDaysAllocated,
    getPaidLeaveAllocationLabel,
    getRttAllocationLabel,
    getDialogTitle,
    getPaidLeaveHelperText,
    getRttHelperText,
    isAllocation: isAllocationForm
  } = useLeaveRequestForm({
    onClose,
    onSuccess,
    employeeId,
    isAllocation
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>

        <LeaveRequestFormContent
          form={form}
          handleTypeChange={handleTypeChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          showPaidLeaveAllocation={showPaidLeaveAllocation}
          showRttAllocation={showRttAllocation}
          syncDaysAllocated={syncDaysAllocated}
          getPaidLeaveAllocationLabel={getPaidLeaveAllocationLabel}
          getRttAllocationLabel={getRttAllocationLabel}
          getPaidLeaveHelperText={getPaidLeaveHelperText}
          getRttHelperText={getRttHelperText}
          hideEmployeeField={!!employeeId}
          isAllocation={isAllocationForm}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewLeaveRequestForm;
