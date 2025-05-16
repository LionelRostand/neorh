
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils';
import type { Employee } from '@/types/employeeTypes';

export const useEmployeeUpdate = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Update an existing employee
  const updateEmployee = async (id: string, employeeData: Partial<Employee>) => {
    try {
      setIsProcessing(true);
      console.log('Updating employee in Firebase:', id, employeeData);
      
      // Update in Firebase
      await updateDoc(doc(db, 'hr_employees', id), {
        ...employeeData,
        updatedAt: new Date().toISOString()
      });
      
      showSuccessToast("Employé mis à jour avec succès");
      return true;
    } catch (error) {
      console.error('Error updating employee:', error);
      showErrorToast("Impossible de mettre à jour l'employé");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    updateEmployee,
    isProcessing
  };
};
