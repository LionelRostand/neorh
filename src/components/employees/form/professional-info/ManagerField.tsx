
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
import { Employee } from '@/types/employee';

interface ManagerFieldProps {
  form: UseFormReturn<EmployeeFormValues>;
  managers: Employee[];
  isLoading: boolean;
}

export function ManagerField({ form, managers, isLoading }: ManagerFieldProps) {
  return (
    <FormField
      control={form.control}
      name="managerId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Responsable</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value || "no-manager"}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un responsable" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="no-manager">Aucun responsable</SelectItem>
              {managers.map((manager) => (
                <SelectItem key={manager.id} value={manager.id || "manager-unknown"}>
                  {manager.name}
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
