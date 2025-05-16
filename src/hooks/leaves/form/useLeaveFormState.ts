
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
      type: "allocation", // Default type for allocation
      startDate: new Date(),
      endDate: new Date(),
      comment: "",
      daysAllocated: 0,
      paidDaysAllocated: 25, // Default value for France
      rttDaysAllocated: 12, // Default value for RTT
      isAllocation: true // Always in allocation mode
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
