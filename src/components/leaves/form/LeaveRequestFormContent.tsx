
import React from "react";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { LeaveFormValues } from "./types";
import { EmployeeField } from "./EmployeeField";
import { DatePickerField } from "./DatePickerField";
import { CommentField } from "./CommentField";
import { LeaveFormActions } from "./LeaveFormActions";
import { AllocationFields } from "./AllocationFields";

interface LeaveRequestFormContentProps {
  form: UseFormReturn<LeaveFormValues>;
  employeeId?: string;
  isAllocation?: boolean;
  showPaidLeaveAllocation: boolean;
  showRttAllocation: boolean;
  getPaidLeaveAllocationLabel: () => string;
  getRttAllocationLabel: () => string;
  getPaidLeaveHelperText: () => string | undefined;
  getRttHelperText: () => string | undefined;
  syncDaysAllocated: (type: string, value: number) => void;
  onSubmit: () => void;
  onClose: () => void;
  isSubmitting: boolean;
  onTypeChange?: (type: string) => void;
}

export function LeaveRequestFormContent({
  form,
  employeeId,
  isAllocation = false,
  showPaidLeaveAllocation,
  showRttAllocation,
  getPaidLeaveAllocationLabel,
  getRttAllocationLabel,
  getPaidLeaveHelperText,
  getRttHelperText,
  syncDaysAllocated,
  onSubmit,
  onClose,
  isSubmitting
}: LeaveRequestFormContentProps) {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {!employeeId && <EmployeeField form={form} />}
        
        <div className="grid grid-cols-1 gap-4">
          <AllocationFields 
            form={form}
            showPaidLeaveAllocation={showPaidLeaveAllocation}
            showRttAllocation={false}
            paidLeaveLabel={getPaidLeaveAllocationLabel()}
            rttLabel=""
            paidLeaveHelperText={getPaidLeaveHelperText()}
            rttHelperText=""
            onSync={(type, value) => syncDaysAllocated("paid", value)}
          />
          
          <AllocationFields 
            form={form}
            showPaidLeaveAllocation={false}
            showRttAllocation={showRttAllocation}
            paidLeaveLabel=""
            rttLabel={getRttAllocationLabel()}
            paidLeaveHelperText=""
            rttHelperText={getRttHelperText()}
            onSync={(type, value) => syncDaysAllocated("rtt", value)}
          />
        </div>
        
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
          onCancel={onClose} 
          isSubmitting={isSubmitting} 
          submitLabel={isAllocation ? "Attribuer les congés" : "Soumettre la demande"}
        />
      </form>
    </Form>
  );
}
