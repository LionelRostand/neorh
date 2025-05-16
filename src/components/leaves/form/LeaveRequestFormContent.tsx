
import React from "react";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { LeaveFormValues } from "./types";
import { EmployeeField } from "./EmployeeField";
import { LeaveTypeField, defaultLeaveTypes } from "./LeaveTypeField";
import { DatePickerField } from "./DatePickerField";
import { CommentField } from "./CommentField";
import { LeaveFormActions } from "./LeaveFormActions";
import { AllocationFields } from "./AllocationFields";

interface LeaveRequestFormContentProps {
  form: UseFormReturn<LeaveFormValues>;
  handleTypeChange: (type: string) => void;
  handleSubmit: (data: LeaveFormValues) => Promise<void>;
  isSubmitting: boolean;
  showPaidLeaveAllocation: boolean;
  showRttAllocation: boolean;
  syncDaysAllocated: (type: string, value: number) => void;
  getPaidLeaveAllocationLabel: () => string;
  getRttAllocationLabel: () => string;
  getPaidLeaveHelperText: () => string | undefined;
  getRttHelperText: () => string | undefined;
  hideEmployeeField?: boolean;
  isAllocation: boolean;
  onCancel: () => void;
}

export function LeaveRequestFormContent({
  form,
  handleTypeChange,
  handleSubmit,
  isSubmitting,
  showPaidLeaveAllocation,
  showRttAllocation,
  syncDaysAllocated,
  getPaidLeaveAllocationLabel,
  getRttAllocationLabel,
  getPaidLeaveHelperText,
  getRttHelperText,
  hideEmployeeField = false,
  isAllocation,
  onCancel
}: LeaveRequestFormContentProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {!hideEmployeeField && <EmployeeField form={form} />}
        <LeaveTypeField 
          form={form} 
          onTypeChange={handleTypeChange} 
          allowedTypes={isAllocation ? defaultLeaveTypes : undefined}
        />
        
        <AllocationFields
          form={form}
          showPaidLeaveAllocation={showPaidLeaveAllocation}
          showRttAllocation={showRttAllocation}
          paidLeaveLabel={getPaidLeaveAllocationLabel()}
          rttLabel={getRttAllocationLabel()}
          paidLeaveHelperText={getPaidLeaveHelperText()}
          rttHelperText={getRttHelperText()}
          onPaidChange={(value) => syncDaysAllocated("paid", value)}
          onRttChange={(value) => syncDaysAllocated("rtt", value)}
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
