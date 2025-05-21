
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ContractFormValues } from '../schema';

interface ConventionCollectiveFieldProps {
  control: Control<ContractFormValues>;
}

export const ConventionCollectiveField: React.FC<ConventionCollectiveFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="conventionCollective"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Convention Collective</FormLabel>
          <FormControl>
            <Input placeholder="Convention Collective applicable" {...field} value={field.value || ''} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
