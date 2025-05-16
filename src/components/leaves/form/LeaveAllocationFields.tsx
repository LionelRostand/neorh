
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { LeaveFormValues } from "./types";
import { DaysAllocationField } from "./DaysAllocationField";

interface LeaveAllocationFieldsProps {
  form: UseFormReturn<LeaveFormValues>;
  showPaidLeaveAllocation: boolean;
  showRttAllocation: boolean;
  paidLeaveLabel: string;
  rttLabel: string;
  paidLeaveHelperText?: string;
  rttHelperText?: string;
  onSyncDaysAllocated: (type: string, value: number) => void;
}

export function LeaveAllocationFields({
  form,
  showPaidLeaveAllocation,
  showRttAllocation,
  paidLeaveLabel,
  rttLabel,
  paidLeaveHelperText,
  rttHelperText,
  onSyncDaysAllocated
}: LeaveAllocationFieldsProps) {
  return (
    <>
      {/* Champ d'allocation pour congés payés */}
      {showPaidLeaveAllocation && (
        <DaysAllocationField 
          form={form} 
          name="paidDaysAllocated"
          label={paidLeaveLabel}
          helperText={paidLeaveHelperText}
          onChange={(value) => onSyncDaysAllocated("paid", value)}
        />
      )}
      
      {/* Champ d'allocation pour RTT */}
      {showRttAllocation && (
        <DaysAllocationField 
          form={form} 
          name="rttDaysAllocated"
          label={rttLabel}
          helperText={rttHelperText}
          onChange={(value) => onSyncDaysAllocated("rtt", value)}
        />
      )}
    </>
  );
}
