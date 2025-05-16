
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { LeaveFormValues } from "./types";
import { useLeaveFormLabels } from "@/hooks/leaves/form";

interface LeaveTypeFieldProps {
  form: UseFormReturn<LeaveFormValues>;
  onTypeChange?: (type: string) => void;
}

export function LeaveTypeField({ form, onTypeChange }: LeaveTypeFieldProps) {
  const { getLeaveTypeLabel, getLeaveTypeOptions } = useLeaveFormLabels();
  const leaveTypeOptions = getLeaveTypeOptions();

  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{getLeaveTypeLabel()}</FormLabel>
          <Select
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              if (onTypeChange) {
                onTypeChange(value);
              }
            }}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type de congé" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {leaveTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
