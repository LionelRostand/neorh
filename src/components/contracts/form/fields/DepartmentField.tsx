
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ContractFormValues } from "../schema";
import { Department } from "@/types/firebase";

interface DepartmentFieldProps {
  form: UseFormReturn<ContractFormValues>;
  departments: Department[];
}

export default function DepartmentField({ form, departments }: DepartmentFieldProps) {
  return (
    <FormField
      control={form.control}
      name="departmentId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Departement</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un département" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {departments.map((department) => (
                <SelectItem key={department.id || ''} value={department.id || ''}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
