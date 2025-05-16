
import { useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils';

export const useEmployeeDelete = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Delete an employee
  const deleteEmployee = async (id: string) => {
    try {
      setIsProcessing(true);
      
      // Delete the employee from Firebase
      await deleteDoc(doc(db, 'hr_employees', id));
      
      console.log('Employee deleted successfully:', id);
      showSuccessToast("Employé supprimé avec succès");
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      showErrorToast("Impossible de supprimer l'employé");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Bulk delete employees
  const bulkDelete = async (ids: string[]) => {
    try {
      setIsProcessing(true);
      
      // Delete multiple employees from Firebase
      const deletePromises = ids.map(id => 
        deleteDoc(doc(db, 'hr_employees', id))
      );
      
      await Promise.all(deletePromises);
      
      console.log('Bulk deleted employees:', ids);
      showSuccessToast("Employés supprimés avec succès");
      return true;
    } catch (error) {
      console.error('Error bulk deleting employees:', error);
      showErrorToast("Impossible de supprimer les employés sélectionnés");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    deleteEmployee,
    bulkDelete,
    isProcessing
  };
};
