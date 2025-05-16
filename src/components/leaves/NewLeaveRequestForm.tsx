
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNewLeaveRequestForm } from "./form/useNewLeaveRequestForm";
import { LeaveFormContent } from "./form/LeaveFormContent";

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
    selectedType,
    showPaidLeaveAllocation,
    showRttAllocation,
    handleTypeChange,
    syncDaysAllocated,
    handleSubmitForm,
    isSubmitting,
    getPaidLeaveAllocationLabel,
    getRttAllocationLabel,
    getDialogTitle,
    getPaidLeaveHelperText,
    getRttHelperText,
  } = useNewLeaveRequestForm(onClose, onSuccess, employeeId, isAllocation);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>

        <LeaveFormContent
          form={form}
          onSubmit={handleSubmitForm}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          showEmployeeField={!employeeId}
          isAllocation={isAllocation}
          showPaidLeaveAllocation={showPaidLeaveAllocation}
          showRttAllocation={showRttAllocation}
          onTypeChange={handleTypeChange}
          onSyncDaysAllocated={syncDaysAllocated}
          getPaidLeaveAllocationLabel={getPaidLeaveAllocationLabel}
          getRttAllocationLabel={getRttAllocationLabel}
          getPaidLeaveHelperText={getPaidLeaveHelperText}
          getRttHelperText={getRttHelperText}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewLeaveRequestForm;
