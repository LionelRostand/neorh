
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Employee } from "@/types/employee";
import { BadgeFormValues } from "./FormSchema";

interface EmployeeSectionProps {
  form: UseFormReturn<BadgeFormValues>;
  employees: Employee[];
  isLoading: boolean;
}

export function EmployeeSection({ form, employees, isLoading }: EmployeeSectionProps) {
  return (
    <FormField
      control={form.control}
      name="employeeId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Employé</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un employé" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem
                  key={employee.id}
                  value={employee.id || "employee-unknown"}
                >
                  {employee.name || `${employee.firstName || ''} ${employee.lastName || ''}`}
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
