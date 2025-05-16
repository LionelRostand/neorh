
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useEmployeeUpdate } from '@/hooks/employee/useEmployeeUpdate';
import { editEmployeeFormSchema, EmployeeEditFormValues } from './types';
import { Employee } from '@/types/employee';
import { EditEmployeePersonalInfo } from './EditEmployeePersonalInfo';
import { EditEmployeeStatusInfo } from './EditEmployeeStatusInfo';
import { DialogFooter } from '@/components/ui/dialog';

interface EditEmployeeFormProps {
  employee: Employee | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditEmployeeForm({ employee, onClose, onSuccess }: EditEmployeeFormProps) {
  const { updateEmployee, isProcessing } = useEmployeeUpdate();
  
  const form = useForm<EmployeeEditFormValues>({
    resolver: zodResolver(editEmployeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      status: 'active' as const,
      managerId: "",
      photoUrl: "",
      professionalEmail: "",
    },
  });

  // Mise à jour du formulaire lorsqu'un employé est sélectionné
  useEffect(() => {
    if (employee) {
      const startDate = employee.startDate ? new Date(employee.startDate) : new Date();
      
      form.reset({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        position: employee.position || '',
        department: employee.department || '',
        status: employee.status || 'active',
        startDate: startDate,
        photoUrl: employee.photoUrl || '',
        managerId: employee.managerId || '',
        professionalEmail: employee.professionalEmail || '',
      });
    }
  }, [employee, form]);

  const onSubmit = async (data: EmployeeEditFormValues) => {
    if (!employee?.id) return;
    
    try {
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Prepare the employee data for Firebase
      const updatedEmployeeData = {
        firstName: firstName,
        lastName: lastName,
        email: data.email,
        phone: data.phone || '',
        position: data.position,
        department: employee.departmentId || '', // Keep the original departmentId
        status: data.status,
        hireDate: data.startDate ? format(data.startDate, 'yyyy-MM-dd') : '',
        photoUrl: data.photoUrl || '',
        professionalEmail: data.professionalEmail || ''
      };

      const success = await updateEmployee(employee.id, updatedEmployeeData);
      
      if (success) {
        toast({
          title: "Employé mis à jour",
          description: "Les informations de l'employé ont été mises à jour avec succès."
        });
        
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations de l'employé.",
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EditEmployeePersonalInfo form={form} />
          <EditEmployeeStatusInfo form={form} />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
            Annuler
          </Button>
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? "Mise à jour..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
