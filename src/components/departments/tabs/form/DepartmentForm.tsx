
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Department } from '@/types/firebase';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { DepartmentFormValues, departmentFormSchema } from '../schema/departmentSchema';
import { BasicInfoSection } from './sections/BasicInfoSection';
import { ColorSelector } from './sections/ColorSelector';

interface DepartmentFormProps {
  department: Department | null;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DepartmentFormValues) => Promise<void>;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  department,
  isLoading,
  onOpenChange,
  onSubmit,
}) => {
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: department?.name || '',
      description: department?.description || '',
      managerId: department?.managerId || '',
      companyId: department?.companyId || '',
      color: department?.color || '',
    }
  });

  // Update form values when department changes
  useEffect(() => {
    if (department) {
      form.reset({
        name: department.name || '',
        description: department.description || '',
        managerId: department.managerId || '',
        companyId: department.companyId || '',
        color: department.color || '',
      });
    }
  }, [department, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <BasicInfoSection control={form.control} />
        <ColorSelector control={form.control} />

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

export default DepartmentForm;
