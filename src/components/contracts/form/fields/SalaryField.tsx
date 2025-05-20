
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
import { ContractFormValues } from "../schema";

interface SalaryFieldProps {
  control: Control<ContractFormValues>;
}

export default function SalaryField({ control }: SalaryFieldProps) {
  return (
    <FormField
      control={control}
      name="salary"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Salaire brut annuel (€)</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder="Salaire annuel"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
