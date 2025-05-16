
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LeaveFormValues } from "@/components/leaves/form/types";

/**
 * Hook to manage the form state for leave requests
 */
export function useLeaveFormState(
  employeeId?: string,
  isAllocation = false
) {
  // State for showing allocation fields
  const [showPaidLeaveAllocation, setShowPaidLeaveAllocation] = useState<boolean>(true);
  const [showRttAllocation, setShowRttAllocation] = useState<boolean>(true);

  // Initialize form with default values
  const form = useForm<LeaveFormValues>({
    defaultValues: {
      employeeId: employeeId || "",
      type: isAllocation ? "allocation" : "paid", // Default type for requests is paid leave, allocation for allocations
      startDate: new Date(),
      endDate: new Date(),
      comment: "",
      daysAllocated: 0,
      paidDaysAllocated: isAllocation ? 25 : undefined, // Default value for France
      rttDaysAllocated: isAllocation ? 12 : undefined, // Default value for RTT
      isAllocation: isAllocation // Flag to identify if it's an allocation or a request
    },
  });

  return {
    form,
    showPaidLeaveAllocation,
    setShowPaidLeaveAllocation,
    showRttAllocation,
    setShowRttAllocation
  };
}
