
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
import { Textarea } from '@/components/ui/textarea';
import { DepartmentFormValues } from '../../schema/departmentSchema';
import { useManagersData } from '@/hooks/useManagersData';
import { useCompaniesData } from '@/hooks/useCompaniesData';

interface BasicInfoSectionProps {
  control: Control<DepartmentFormValues>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ control }) => {
  const { companies } = useCompaniesData();
  const { managers } = useManagersData();

  return (
    <>
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

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Description du département" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="managerId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Responsable</FormLabel>
            <FormControl>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...field}
              >
                <option value="">Aucun responsable</option>
                {managers && managers.map(manager => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="companyId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entreprise</FormLabel>
            <FormControl>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...field}
              >
                <option value="">Sélectionner une entreprise</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
