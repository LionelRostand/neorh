
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { useDepartmentsData } from '@/hooks/useDepartmentsData';
import { useManagersData } from '@/hooks/useManagersData';
import { EmployeePhotoUpload } from './EmployeePhotoUpload';
import { EmployeePersonalInfo } from './EmployeePersonalInfo';
import { EmployeeAddressInfo } from './EmployeeAddressInfo';
import { EmployeeProfessionalInfo } from './EmployeeProfessionalInfo';
import { usePhotoUpload } from './usePhotoUpload';
import { employeeFormSchema, EmployeeFormValues } from './types';

interface EmployeeFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function EmployeeForm({ onClose, onSuccess }: EmployeeFormProps) {
  const { 
    photoPreview, 
    isUploading, 
    setIsUploading, 
    handlePhotoChange, 
    uploadPhoto 
  } = usePhotoUpload();
  
  // Récupérer les données des entreprises, départements et responsables
  const { companies, isLoading: isLoadingCompanies } = useCompaniesData();
  const { departments, isLoading: isLoadingDepartments } = useDepartmentsData();
  const { managers, isLoading: isLoadingManagers } = useManagersData();

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

  const onSubmit = async (data: EmployeeFormValues) => {
    setIsUploading(true);
    
    try {
      // Téléverser la photo si elle existe
      const photoUrl = await uploadPhoto();
      
      // Préparer les données de l'employé pour Firebase
      const employeeData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        birthDate: format(data.birthDate, 'yyyy-MM-dd'),
        address: {
          streetNumber: data.streetNumber,
          streetName: data.streetName,
          city: data.city,
          postalCode: data.postalCode,
        },
        department: data.department,
        company: data.company,
        position: data.position,
        professionalEmail: data.professionalEmail || data.email,
        managerId: data.managerId || '',
        photoUrl: photoUrl || '',
        status: 'active',
        hireDate: format(new Date(), 'yyyy-MM-dd'),
      };

      // Utiliser l'API Firestore pour ajouter l'employé
      const { db } = await import('@/lib/firebase');
      const { collection, addDoc } = await import('firebase/firestore');
      
      const docRef = await addDoc(collection(db, 'hr_employees'), employeeData);
      
      toast({
        title: "Succès",
        description: "L'employé a été ajouté avec succès",
      });
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'employé:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'employé",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

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
