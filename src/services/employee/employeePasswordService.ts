
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UpdateEmployeePasswordResult } from '@/types/employeeAuth';

export const updateEmployeePassword = async (
  employeeId: string, 
  newPassword: string
): Promise<UpdateEmployeePasswordResult> => {
  try {
    // Mettre à jour les informations dans Firestore
    const employeeRef = doc(db, 'hr_employees', employeeId);
    await updateDoc(employeeRef, {
      hasDefaultPassword: true,
      passwordUpdatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating employee password:', error);
    return { 
      success: false, 
      error: 'Erreur lors de la mise à jour du mot de passe' 
    };
  }
};
