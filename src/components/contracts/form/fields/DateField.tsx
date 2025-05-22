
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { EditContractFormValues } from "../editSchema";

interface DateFieldProps {
  control: Control<EditContractFormValues>;
  name: "startDate" | "endDate";
  label: string;
  required?: boolean;
}

export default function DateField({ control, name, label, required = true }: DateFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required ? '' : ' (optionnelle)'}</FormLabel>
          <FormControl>
            <Input 
              type="date" 
              {...field} 
              value={field.value || ''} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
