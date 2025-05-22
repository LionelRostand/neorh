
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

interface EmployeeNameFieldProps {
  control: Control<EditContractFormValues>;
}

export default function EmployeeNameField({ control }: EmployeeNameFieldProps) {
  return (
    <FormField
      control={control}
      name="employeeName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nom de l'employé</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Nom de l'employé" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
