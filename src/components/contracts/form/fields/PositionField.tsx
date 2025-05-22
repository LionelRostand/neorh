
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

interface PositionFieldProps {
  control: Control<ContractFormValues>;
}

export default function PositionField({ control }: PositionFieldProps) {
  return (
    <FormField
      control={control}
      name="position"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Poste</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Poste" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
