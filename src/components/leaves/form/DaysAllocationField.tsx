
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { LeaveFormValues } from "./types";

interface DaysAllocationFieldProps {
  form: UseFormReturn<LeaveFormValues>;
  label: string;
  helperText?: string;
}

export function DaysAllocationField({ form, label, helperText }: DaysAllocationFieldProps) {
  return (
    <FormField
      control={form.control}
      name="daysAllocated"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => form.setValue("daysAllocated", Math.max(0, Number(field.value) - 1))}
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
                value={field.value || 0}
              />
            </FormControl>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => form.setValue("daysAllocated", Number(field.value) + 1)}
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
