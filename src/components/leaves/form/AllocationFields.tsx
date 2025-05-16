
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { LeaveFormValues } from "./types";
import { DaysAllocationField } from "./DaysAllocationField";

interface AllocationFieldsProps {
  form: UseFormReturn<LeaveFormValues>;
  showPaidLeaveAllocation: boolean;
  showRttAllocation: boolean;
  paidLeaveLabel: string;
  rttLabel: string;
  paidLeaveHelperText?: string;
  rttHelperText?: string;
  onPaidChange: (value: number) => void;
  onRttChange: (value: number) => void;
}

export function AllocationFields({
  form,
  showPaidLeaveAllocation,
  showRttAllocation,
  paidLeaveLabel,
  rttLabel,
  paidLeaveHelperText,
  rttHelperText,
  onPaidChange,
  onRttChange
}: AllocationFieldsProps) {
  return (
    <>
      {/* Champ d'allocation pour congés payés */}
      {showPaidLeaveAllocation && (
        <DaysAllocationField 
          form={form} 
          name="paidDaysAllocated"
          label={paidLeaveLabel}
          helperText={paidLeaveHelperText}
          onChange={onPaidChange}
        />
      )}
      
      {/* Champ d'allocation pour RTT */}
      {showRttAllocation && (
        <DaysAllocationField 
          form={form} 
          name="rttDaysAllocated"
          label={rttLabel}
          helperText={rttHelperText}
          onChange={onRttChange}
        />
      )}
    </>
  );
}
