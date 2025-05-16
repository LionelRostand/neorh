
import { useState } from 'react';
import { usePhotoUpload } from '../usePhotoUpload';
import { EmployeeFormValues } from '../types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

interface UseEmployeeFormSubmitOptions {
  onClose: () => void;
  onSuccess?: () => void;
  clearFormData: () => void;
}

export function useEmployeeFormSubmit({ 
  onClose, 
  onSuccess, 
  clearFormData 
}: UseEmployeeFormSubmitOptions) {
  const { 
    photoPreview, 
    isUploading, 
    setIsUploading, 
    handlePhotoChange, 
    uploadPhoto,
    resetPhoto 
  } = usePhotoUpload();

  const onSubmit = async (data: EmployeeFormValues) => {
    setIsUploading(true);
    
    try {
      // Get photo base64
      const photoBase64 = await uploadPhoto();
      
      // Prepare employee data for Firebase
      const employeeData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        birthDate: data.birthDate ? format(data.birthDate, 'yyyy-MM-dd') : '',
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
        photoBase64: photoBase64 || '', // Direct base64 storage
        status: 'active',
        hireDate: format(new Date(), 'yyyy-MM-dd'),
      };

      // Add employee to Firestore
      const employeesCollection = collection(db, 'hr_employees');
      const docRef = await addDoc(employeesCollection, employeeData);
      
      toast({
        title: "Succès",
        description: "L'employé a été ajouté avec succès",
      });
      
      // Clean up saved data
      clearFormData();
      resetPhoto();
      
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

  return {
    photoPreview,
    isUploading,
    handlePhotoChange,
    onSubmit
  };
}
