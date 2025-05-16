
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { Department } from '@/types/firebase';
import { useManagersData } from '@/hooks/useManagersData';
import { useCompaniesData } from '@/hooks/useCompaniesData';

// Define colors
export const DEPARTMENT_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#EF4444', // red
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#6B7280', // gray
  '#111827', // dark
];

// Define the form schema with zod
export const departmentFormSchema = z.object({
  name: z.string().min(1, { message: 'Le nom du département est requis' }),
  description: z.string().optional(),
  managerId: z.string().optional(),
  companyId: z.string().optional(),
  color: z.string().optional(),
});

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

interface DepartmentInformationTabProps {
  department: Department | null;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DepartmentFormValues) => Promise<void>;
}

const DepartmentInformationTab: React.FC<DepartmentInformationTabProps> = ({
  department,
  isLoading,
  onOpenChange,
  onSubmit,
}) => {
  const { companies } = useCompaniesData();
  const { managers } = useManagersData();

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: department?.name || '',
      description: department?.description || '',
      managerId: department?.managerId || '',
      companyId: department?.companyId || '',
      color: department?.color || DEPARTMENT_COLORS[0],
    }
  });

  // Update form values when department changes
  React.useEffect(() => {
    if (department) {
      form.reset({
        name: department.name || '',
        description: department.description || '',
        managerId: department.managerId || '',
        companyId: department.companyId || '',
        color: department.color || DEPARTMENT_COLORS[0],
      });
    }
  }, [department, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
                      {manager.firstName} {manager.lastName}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
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

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Couleur</FormLabel>
              <FormControl>
                <RadioGroup 
                  className="flex space-x-2" 
                  value={field.value} 
                  onValueChange={field.onChange}
                >
                  {DEPARTMENT_COLORS.map((color) => (
                    <FormItem key={color} className="space-y-0">
                      <FormControl>
                        <RadioGroupItem 
                          value={color} 
                          id={color}
                          className="sr-only"
                        />
                      </FormControl>
                      <label
                        htmlFor={color}
                        className={`block h-8 w-8 rounded-full cursor-pointer border-2 ${
                          field.value === color ? 'border-black' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4 mr-2" /> Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Check className="h-4 w-4 mr-2" /> Enregistrer
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default DepartmentInformationTab;
