
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { LeaveFormValues } from "@/components/leaves/form/types";

/**
 * Hook to handle form values and synchronization
 */
export function useLeaveFormValues(
  form: UseFormReturn<LeaveFormValues>,
  employeeId?: string,
  isAllocation = false
) {
  // Update employeeId if provided as prop
  useEffect(() => {
    if (employeeId) {
      form.setValue("employeeId", employeeId);
    }
    
    // Set allocation flags
    form.setValue("isAllocation", true);
    form.setValue("type", "allocation");
  }, [employeeId, form, isAllocation]);

  // Synchronize daysAllocated with paidDaysAllocated or rttDaysAllocated
  const syncDaysAllocated = (type: string, value: number) => {
    if (type === "paid") {
      form.setValue("paidDaysAllocated", value);
    } else if (type === "rtt") {
      form.setValue("rttDaysAllocated", value);
    }
  };

  return {
    syncDaysAllocated
  };
}
