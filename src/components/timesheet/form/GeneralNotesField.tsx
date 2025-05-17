
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { TimesheetFormValues } from './types';

interface GeneralNotesFieldProps {
  form: UseFormReturn<TimesheetFormValues>;
  canEdit: boolean;
}

const GeneralNotesField: React.FC<GeneralNotesFieldProps> = ({ form, canEdit }) => {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes générales</FormLabel>
          <FormControl>
            <Textarea
              disabled={!canEdit}
              placeholder="Notes ou commentaires sur cette feuille de temps"
              {...field}
              rows={3}
            />
          </FormControl>
          <FormDescription>
            Informations supplémentaires concernant cette période de travail.
          </FormDescription>
        </FormItem>
      )}
    />
  );
};

export default GeneralNotesField;
