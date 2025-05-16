
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

interface EmailFieldProps {
  form: UseFormReturn<EmployeeFormValues>;
}

export function EmailField({ form }: EmailFieldProps) {
  return (
    <FormField
      control={form.control}
      name="professionalEmail"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email professionnel</FormLabel>
          <FormControl>
            <Input placeholder="pro@example.com" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
