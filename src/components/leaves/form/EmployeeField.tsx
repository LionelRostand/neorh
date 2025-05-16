
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
import { useEmployeeData } from "@/hooks/useEmployeeData";

interface EmployeeFieldProps {
  form: UseFormReturn<LeaveFormValues>;
}

export function EmployeeField({ form }: EmployeeFieldProps) {
  const { employees, isLoading: loadingEmployees } = useEmployeeData();
  
  return (
    <FormField
      control={form.control}
      name="employeeId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Employé</FormLabel>
          <Select
            disabled={loadingEmployees}
            onValueChange={field.onChange}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un employé" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id || ""}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
