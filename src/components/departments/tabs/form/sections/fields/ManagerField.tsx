
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
import { useManagersData } from '@/hooks/useManagersData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ManagerFieldProps {
  control: Control<DepartmentFormValues>;
}

export const ManagerField: React.FC<ManagerFieldProps> = ({ control }) => {
  const { managers } = useManagersData();

  return (
    <FormField
      control={control}
      name="managerId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Responsable</FormLabel>
          <FormControl>
            <Select 
              onValueChange={field.onChange} 
              value={field.value || undefined}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Aucun responsable" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-manager">Aucun responsable</SelectItem>
                {managers && managers.map(manager => (
                  <SelectItem key={manager.id} value={manager.id || "no-manager-id"}>
                    {manager.name}
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
