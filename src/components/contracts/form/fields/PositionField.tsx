
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

interface PositionFieldProps {
  form: UseFormReturn<ContractFormValues>;
}

export default function PositionField({ form }: PositionFieldProps) {
  return (
    <FormField
      control={form.control}
      name="position"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Poste</FormLabel>
          <FormControl>
            <Input placeholder="Ex: Développeur Web Senior" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
