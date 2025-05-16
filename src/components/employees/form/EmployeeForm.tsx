
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { useDepartmentsData } from '@/hooks/useDepartmentsData';
import { useManagersData } from '@/hooks/useManagersData';
import { EmployeePhotoUpload } from './EmployeePhotoUpload';
import { EmployeePersonalInfo } from './EmployeePersonalInfo';
import { EmployeeAddressInfo } from './EmployeeAddressInfo';
import { EmployeeProfessionalInfo } from './EmployeeProfessionalInfo';
import { employeeFormSchema, EmployeeFormValues } from './types';
import { usePersistForm } from './hooks/usePersistForm';
import { useEmployeeFormSubmit } from './hooks/useEmployeeFormSubmit';

interface EmployeeFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function EmployeeForm({ onClose, onSuccess }: EmployeeFormProps) {
  // Initialize the form
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      streetNumber: "",
      streetName: "",
      city: "",
      postalCode: "",
      department: "",
      company: "",
      position: "",
      professionalEmail: "",
    },
  });

  // Load and persist form data
  const { clearFormData } = usePersistForm(form);
  
  // Get companies, departments, and managers data
  const { companies, isLoading: isLoadingCompanies } = useCompaniesData();
  const { departments, isLoading: isLoadingDepartments } = useDepartmentsData();
  const { managers, isLoading: isLoadingManagers } = useManagersData();
  
  // Set up form submission
  const { 
    photoPreview, 
    isUploading, 
    handlePhotoChange, 
    onSubmit 
  } = useEmployeeFormSubmit({ 
    onClose, 
    onSuccess, 
    clearFormData 
  });

  return (
    <div className="space-y-6 px-2 py-4 max-h-[80vh] overflow-y-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">Ajouter un nouvel employé</h2>
        <p className="text-sm text-muted-foreground">Complétez les informations de l'employé ci-dessous.</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Photo de profil */}
          <EmployeePhotoUpload 
            photoPreview={photoPreview}
            onChange={handlePhotoChange}
          />

          {/* Informations personnelles */}
          <EmployeePersonalInfo form={form} />
          
          {/* Adresse */}
          <EmployeeAddressInfo form={form} />

          {/* Informations professionnelles */}
          <EmployeeProfessionalInfo 
            form={form}
            companies={companies} 
            departments={departments}
            managers={managers}
            isLoadingCompanies={isLoadingCompanies}
            isLoadingDepartments={isLoadingDepartments}
            isLoadingManagers={isLoadingManagers}
          />
          
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isUploading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading || isLoadingCompanies || isLoadingDepartments || isLoadingManagers}
            >
              {isUploading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
