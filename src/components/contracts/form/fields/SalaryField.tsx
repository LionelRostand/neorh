
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ContractFormValues } from "../schema";

interface SalaryFieldProps {
  form: UseFormReturn<ContractFormValues>;
}

export default function SalaryField({ form }: SalaryFieldProps) {
  return (
    <FormField
      control={form.control}
      name="salary"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Salaire annuel (€)</FormLabel>
          <FormControl>
            <Input placeholder="Ex: 45000" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
