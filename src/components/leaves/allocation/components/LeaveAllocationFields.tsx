
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { AllocationFormValues } from "../hooks/useLeaveAllocationForm";
import { EmployeeField } from "../../form/EmployeeField";

interface LeaveAllocationFieldsProps {
  form: UseFormReturn<AllocationFormValues>;
  employeeId?: string;
}

const LeaveAllocationFields: React.FC<LeaveAllocationFieldsProps> = ({ 
  form, 
  employeeId 
}) => {
  return (
    <>
      {!employeeId && <EmployeeField form={form} />}
      
      <FormField
        control={form.control}
        name="paidLeavesTotal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Congés payés (jours)</FormLabel>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => form.setValue("paidLeavesTotal", Math.max(0, field.value - 1))}
                className="h-8 w-8"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  {...field}
                  onChange={(e) => field.onChange(Math.max(0, parseInt(e.target.value) || 0))}
                  className="h-9 text-center w-16"
                />
              </FormControl>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => form.setValue("paidLeavesTotal", field.value + 1)}
                className="h-8 w-8"
              >
                <Plus className="h-3 w-3" />
              </Button>
              <span className="text-sm text-gray-500">jours</span>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="rttTotal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>RTT (jours)</FormLabel>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => form.setValue("rttTotal", Math.max(0, field.value - 1))}
                className="h-8 w-8"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  {...field}
                  onChange={(e) => field.onChange(Math.max(0, parseInt(e.target.value) || 0))}
                  className="h-9 text-center w-16"
                />
              </FormControl>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => form.setValue("rttTotal", field.value + 1)}
                className="h-8 w-8"
              >
                <Plus className="h-3 w-3" />
              </Button>
              <span className="text-sm text-gray-500">jours</span>
            </div>
          </FormItem>
        )}
      />
    </>
  );
};

export default LeaveAllocationFields;
