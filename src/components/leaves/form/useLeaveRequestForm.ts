
import { useState } from "react";
import { LeaveFormValues } from "./types";
import { useLeaveFormSubmit } from "./useLeaveFormSubmit";
import { 
  useLeaveFormState, 
  useLeaveFormLabels, 
  useLeaveFormValues 
} from "@/hooks/leaves/form";

export function useLeaveRequestForm(
  onClose: () => void,
  onSuccess?: () => void,
  employeeId?: string,
  isAllocation = false
) {
  // Use our new hooks to manage different aspects of the form
  const { 
    form, 
    showPaidLeaveAllocation, 
    showRttAllocation 
  } = useLeaveFormState(employeeId, isAllocation);

  const { syncDaysAllocated } = useLeaveFormValues(form, employeeId, isAllocation);

  const { 
    getDialogTitle,
    getPaidLeaveHelperText,
    getRttHelperText,
    getPaidLeaveAllocationLabel,
    getRttAllocationLabel
  } = useLeaveFormLabels();

  // Form submission handling
  const { handleSubmit, isSubmitting } = useLeaveFormSubmit(() => {
    form.reset();
    onClose();
    // Call onSuccess if provided to refresh the leave list
    if (onSuccess) {
      onSuccess();
    }
  });

  return {
    form,
    syncDaysAllocated,
    handleFormSubmit: form.handleSubmit(handleSubmit),
    isSubmitting,
    showPaidLeaveAllocation,
    showRttAllocation,
    getPaidLeaveAllocationLabel,
    getRttAllocationLabel,
    getPaidLeaveHelperText,
    getRttHelperText,
    getDialogTitle
  };
}
