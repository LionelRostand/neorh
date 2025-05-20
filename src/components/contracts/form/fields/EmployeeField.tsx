
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
import { Employee } from "@/types/employee";
import { Control } from "react-hook-form";
import { ContractFormValues } from "../schema";

interface EmployeeFieldProps {
  control: Control<ContractFormValues>;
  employees: Employee[];
  employeeName?: string;
  setValue: (id: string, name: string) => void;
}

export default function EmployeeField({ control, employees, setValue, employeeName }: EmployeeFieldProps) {
  return (
    <FormField
      control={control}
      name="employeeId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Employé</FormLabel>
          <Select onValueChange={(value) => {
              const employee = employees.find(e => e.id === value);
              if (employee) {
                setValue(value, employee.name);
              }
              field.onChange(value);
            }} 
            defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name}
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
