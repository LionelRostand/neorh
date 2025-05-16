
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UseFormReturn, FieldPath } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useManagersData } from "@/hooks/useManagersData";

// Define a more generic type so we can reuse this component
export interface EmployeeSelectProps {
  employeeId: string;
}

interface EmployeeFieldProps<T extends EmployeeSelectProps> {
  form: UseFormReturn<T>;
  disabled?: boolean;
}

export function EmployeeField<T extends EmployeeSelectProps>({ form, disabled }: EmployeeFieldProps<T>) {
  const { managers, isLoading } = useManagersData();
  
  return (
    <FormField
      control={form.control}
      name={"employeeId" as FieldPath<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Employé</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value} 
            disabled={disabled || isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {managers.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {`${employee.name}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  )
}
