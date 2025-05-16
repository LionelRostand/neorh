
import React from 'react';
import { Control } from 'react-hook-form';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DepartmentFormValues } from '../../../schema/departmentSchema';

interface NameFieldProps {
  control: Control<DepartmentFormValues>;
}

export const NameField: React.FC<NameFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nom du département</FormLabel>
          <FormControl>
            <Input placeholder="Nom du département" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
