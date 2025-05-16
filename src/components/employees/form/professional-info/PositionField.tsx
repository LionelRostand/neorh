
import React from 'react';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from '../types';

interface PositionFieldProps {
  form: UseFormReturn<EmployeeFormValues>;
}

export function PositionField({ form }: PositionFieldProps) {
  return (
    <FormField
      control={form.control}
      name="position"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Poste</FormLabel>
          <FormControl>
            <Input placeholder="Intitulé du poste" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
