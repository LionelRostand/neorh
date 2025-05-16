
import React from 'react';
import { Control } from 'react-hook-form';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { DepartmentFormValues } from '../../../schema/departmentSchema';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CompanyFieldProps {
  control: Control<DepartmentFormValues>;
}

export const CompanyField: React.FC<CompanyFieldProps> = ({ control }) => {
  const { companies } = useCompaniesData();

  return (
    <FormField
      control={control}
      name="companyId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Entreprise</FormLabel>
          <FormControl>
            <Select 
              onValueChange={field.onChange} 
              value={field.value || undefined}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner une entreprise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-company">Sélectionner une entreprise</SelectItem>
                {companies.map(company => (
                  <SelectItem key={company.id} value={company.id || "no-company-id"}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
