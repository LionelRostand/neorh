
import React from 'react';
import { Control, useController } from 'react-hook-form';
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
import { useDepartmentsData } from '@/hooks/useDepartmentsData';
import { DepartmentFormValues } from '../../../schema/departmentSchema';

interface ParentDepartmentFieldProps {
  control: Control<DepartmentFormValues>;
}

export function ParentDepartmentField({ control }: ParentDepartmentFieldProps) {
  const { departments, isLoading } = useDepartmentsData();
  
  // Get the current department ID without trying to access it through the form control
  // This approach avoids the TypeScript error since we're not using useController for 'id'
  const currentDepartmentId = control._formValues?.id as string | undefined;

  // Filter out the current department to avoid self-reference
  const availableDepartments = departments?.filter(dept => dept.id !== currentDepartmentId) || [];

  return (
    <FormField
      control={control}
      name="parentDepartmentId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Département parent</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value} 
            value={field.value}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un département parent" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">Aucun (département racine)</SelectItem>
              {availableDepartments.map((dept) => (
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
