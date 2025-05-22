
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { ContractFormValues } from '../schema';

interface ConventionCollectiveFieldProps {
  control: Control<ContractFormValues>;
}

const ConventionCollectiveField: React.FC<ConventionCollectiveFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="conventionCollective"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Convention Collective</FormLabel>
          <FormControl>
            <Input
              placeholder="Convention collective applicable"
              {...field}
              value={field.value || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ConventionCollectiveField;
