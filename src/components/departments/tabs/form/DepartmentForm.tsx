
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Department } from '@/types/firebase';
import { DepartmentFormValues, departmentFormSchema } from '../schema/departmentSchema';
import { BasicInfoSection } from './sections/BasicInfoSection';
import { ColorSelector } from './sections/ColorSelector';
import { FormFooter } from './components/FormFooter';

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

  const handleFormSubmit = async (values: DepartmentFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
        <BasicInfoSection control={form.control} />
        <ColorSelector control={form.control} />
        
        <FormFooter 
          isLoading={isLoading} 
          onCancel={() => onOpenChange(false)} 
        />
      </form>
    </Form>
  );
};

export default DepartmentForm;
