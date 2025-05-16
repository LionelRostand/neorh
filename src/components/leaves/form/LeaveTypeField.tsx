
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { LeaveFormValues } from "./types";

// Types de congés selon le droit du travail français
export const leaveTypes = [
  { id: "paid", label: "Congé payé" },
  { id: "rtt", label: "RTT" },
  { id: "sick", label: "Congé Maladie" },
  { id: "family", label: "Congé Familial" },
  { id: "maternity", label: "Congé Maternité" },
  { id: "paternity", label: "Congé Paternité" },
];

interface LeaveTypeFieldProps {
  form: UseFormReturn<LeaveFormValues>;
  onTypeChange?: (type: string) => void;
  allowedTypes?: string[];
}

export function LeaveTypeField({ form, onTypeChange, allowedTypes }: LeaveTypeFieldProps) {
  // Filter types if allowedTypes is provided
  const filteredTypes = allowedTypes 
    ? leaveTypes.filter(type => allowedTypes.includes(type.id)) 
    : leaveTypes;

  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de congé</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              if (onTypeChange) onTypeChange(value);
            }} 
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type de congé" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {filteredTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
