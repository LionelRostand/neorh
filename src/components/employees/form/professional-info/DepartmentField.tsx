
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from '../types';
import { Department } from '@/types/firebase';

interface DepartmentFieldProps {
  form: UseFormReturn<EmployeeFormValues>;
  departments: Department[];
  isLoading: boolean;
}

export function DepartmentField({ form, departments, isLoading }: DepartmentFieldProps) {
  return (
    <FormField
      control={form.control}
      name="department"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Département</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value || "no-department"}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un département" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="no-department">Sélectionnez un département</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id || "dept-unknown"}>
                  {dept.name}
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
