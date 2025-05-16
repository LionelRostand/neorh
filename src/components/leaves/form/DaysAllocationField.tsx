
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { UseFormReturn, FieldPath } from "react-hook-form";
import { LeaveFormValues } from "./types";

interface DaysAllocationFieldProps {
  form: UseFormReturn<LeaveFormValues>;
  label: string;
  helperText?: string;
  name?: keyof LeaveFormValues;
  onChange?: (value: number) => void;
}

export function DaysAllocationField({ 
  form, 
  label, 
  helperText, 
  name = "daysAllocated",
  onChange 
}: DaysAllocationFieldProps) {
  const handleIncrement = () => {
    const currentValue = Number(form.getValues(name as FieldPath<LeaveFormValues>) || 0);
    const newValue = currentValue + 1;
    form.setValue(name as FieldPath<LeaveFormValues>, newValue);
    if (onChange) onChange(newValue);
  };

  const handleDecrement = () => {
    const currentValue = Number(form.getValues(name as FieldPath<LeaveFormValues>) || 0);
    const newValue = Math.max(0, currentValue - 1);
    form.setValue(name as FieldPath<LeaveFormValues>, newValue);
    if (onChange) onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(0, parseInt(e.target.value) || 0);
    form.setValue(name as FieldPath<LeaveFormValues>, newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <FormField
      control={form.control}
      name={name as FieldPath<LeaveFormValues>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              className="h-8 w-8"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <FormControl>
              <Input
                type="number"
                min={0}
                {...field}
                onChange={handleInputChange}
                className="h-9 text-center w-16"
                value={field.value || 0}
                // Fix for the TypeScript error - ensure value is always a number or string
                onBlur={() => {
                  // Ensure value is a number on blur
                  const value = field.value;
                  if (typeof value === 'boolean' || value instanceof Date) {
                    form.setValue(name as FieldPath<LeaveFormValues>, 0);
                  }
                }}
              />
            </FormControl>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              className="h-8 w-8"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <span className="text-sm text-gray-500">jours</span>
          </div>
          {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
        </FormItem>
      )}
    />
  );
}
