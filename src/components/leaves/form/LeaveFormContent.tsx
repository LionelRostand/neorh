
import React from "react";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { LeaveFormValues } from "./types";
import { EmployeeField } from "./EmployeeField";
import { LeaveTypeField, defaultLeaveTypes } from "./LeaveTypeField";
import { DatePickerField } from "./DatePickerField";
import { CommentField } from "./CommentField";
import { LeaveFormActions } from "./LeaveFormActions";
import { LeaveAllocationFields } from "./LeaveAllocationFields";

interface LeaveFormContentProps {
  form: UseFormReturn<LeaveFormValues>;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  showEmployeeField: boolean;
  isAllocation: boolean;
  showPaidLeaveAllocation: boolean;
  showRttAllocation: boolean;
  onTypeChange: (type: string) => void;
  onSyncDaysAllocated: (type: string, value: number) => void;
  getPaidLeaveAllocationLabel: () => string;
  getRttAllocationLabel: () => string;
  getPaidLeaveHelperText: () => string | undefined;
  getRttHelperText: () => string | undefined;
}

export function LeaveFormContent({
  form,
  onSubmit,
  onCancel,
  isSubmitting,
  showEmployeeField,
  isAllocation,
  showPaidLeaveAllocation,
  showRttAllocation,
  onTypeChange,
  onSyncDaysAllocated,
  getPaidLeaveAllocationLabel,
  getRttAllocationLabel,
  getPaidLeaveHelperText,
  getRttHelperText
}: LeaveFormContentProps) {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {showEmployeeField && <EmployeeField form={form} />}
        <LeaveTypeField 
          form={form} 
          onTypeChange={onTypeChange} 
          allowedTypes={isAllocation ? defaultLeaveTypes : undefined}
        />
        
        <LeaveAllocationFields
          form={form}
          showPaidLeaveAllocation={showPaidLeaveAllocation}
          showRttAllocation={showRttAllocation}
          paidLeaveLabel={getPaidLeaveAllocationLabel()}
          rttLabel={getRttAllocationLabel()}
          paidLeaveHelperText={getPaidLeaveHelperText()}
          rttHelperText={getRttHelperText()}
          onSyncDaysAllocated={onSyncDaysAllocated}
        />
        
        <DatePickerField 
          form={form} 
          name="startDate" 
          label="Date de début" 
        />
        <DatePickerField 
          form={form} 
          name="endDate" 
          label="Date de fin"
          disableDates={(date) => {
            const startDate = form.getValues("startDate");
            return startDate ? date < startDate : false;
          }}
        />
        <CommentField form={form} />
        <LeaveFormActions 
          onCancel={onCancel} 
          isSubmitting={isSubmitting} 
          submitLabel={isAllocation ? "Attribuer les congés" : "Soumettre la demande"}
        />
      </form>
    </Form>
  );
}
