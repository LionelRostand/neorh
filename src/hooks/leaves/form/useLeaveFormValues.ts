
import { UseFormReturn } from "react-hook-form";
import { LeaveFormValues } from "@/components/leaves/form/types";

/**
 * Hook pour gérer les valeurs du formulaire de congés
 */
export function useLeaveFormValues(
  form: UseFormReturn<LeaveFormValues>,
  employeeId?: string,
  isAllocation = false
) {
  // Gestion des valeurs de jours alloués
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
