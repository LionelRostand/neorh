
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Employee } from '@/types/employee';

export interface EmployeePasswordData {
  employeeId: string;
  email: string;
  password: string;
}

export const createEmployeeAccount = async (employeeData: EmployeePasswordData) => {
  try {
    const auth = getAuth();
    
    // Créer le compte Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      employeeData.email, 
      employeeData.password
    );
    
    // Mettre à jour l'employé dans Firestore avec les informations d'authentification
    const employeeRef = doc(db, 'hr_employees', employeeData.employeeId);
    await updateDoc(employeeRef, {
      authId: userCredential.user.uid,
      hasDefaultPassword: true,
      defaultPasswordSet: true,
      passwordSetAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Créer un document de profil utilisateur
    const userProfileRef = doc(db, 'user_profiles', userCredential.user.uid);
    await setDoc(userProfileRef, {
      employeeId: employeeData.employeeId,
      email: employeeData.email,
      role: 'employee',
      isEmployee: true,
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      userId: userCredential.user.uid
    };
  } catch (error: any) {
    console.error('Error creating employee account:', error);
    
    // Gestion des erreurs spécifiques
    let errorMessage = 'Erreur lors de la création du compte';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Cette adresse email est déjà utilisée';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Le mot de passe est trop faible';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Adresse email invalide';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

export const updateEmployeePassword = async (employeeId: string, newPassword: string) => {
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
