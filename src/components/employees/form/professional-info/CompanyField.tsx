
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
import { Company } from '@/types/company';

interface CompanyFieldProps {
  form: UseFormReturn<EmployeeFormValues>;
  companies: Company[];
  isLoading: boolean;
}

export function CompanyField({ form, companies, isLoading }: CompanyFieldProps) {
  return (
    <FormField
      control={form.control}
      name="company"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Entreprise</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value || "no-company"}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une entreprise" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="no-company">Sélectionnez une entreprise</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id || "company-unknown"}>
                  {company.name}
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
