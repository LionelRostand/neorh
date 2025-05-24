
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updatePassword as firebaseUpdatePassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, updateDoc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Employee } from '@/types/employee';

export interface EmployeePasswordData {
  employeeId: string;
  email: string;
  password: string;
}

export const createEmployeeAccount = async (employeeData: EmployeePasswordData) => {
  try {
    console.log('🔧 Creating employee account for:', employeeData.email);
    console.log('👤 Employee ID:', employeeData.employeeId);
    
    // Vérifier d'abord si l'employé existe dans Firestore
    const employeeRef = doc(db, 'hr_employees', employeeData.employeeId);
    const employeeDoc = await getDoc(employeeRef);
    
    if (!employeeDoc.exists()) {
      console.error('❌ Employee not found in Firestore:', employeeData.employeeId);
      return {
        success: false,
        error: 'Employé non trouvé dans la base de données'
      };
    }
    
    const employeeInfo = employeeDoc.data();
    console.log('📋 Employee info from Firestore:', {
      firstName: employeeInfo.firstName,
      lastName: employeeInfo.lastName,
      email: employeeInfo.email,
      hasAuthId: !!employeeInfo.authId
    });
    
    const auth = getAuth();
    let userCredential;
    
    try {
      // Essayer de créer le compte Firebase Auth
      console.log('🔐 Creating Firebase Auth account...');
      userCredential = await createUserWithEmailAndPassword(
        auth, 
        employeeData.email, 
        employeeData.password
      );
      console.log('✅ Firebase Auth account created:', userCredential.user.uid);
    } catch (authError: any) {
      if (authError.code === 'auth/email-already-in-use') {
        console.log('📧 Email already exists in Firebase Auth');
        
        // Envoyer un email de réinitialisation de mot de passe
        try {
          console.log('📬 Sending password reset email...');
          await sendPasswordResetEmail(auth, employeeData.email);
          console.log('✅ Password reset email sent');
          
          return {
            success: false,
            error: `Un compte existe déjà avec cet email. Un email de réinitialisation de mot de passe a été envoyé à ${employeeData.email}. Veuillez vérifier votre boîte email et suivre les instructions pour définir votre nouveau mot de passe.`
          };
        } catch (resetError: any) {
          console.error('❌ Error sending password reset email:', resetError);
          return {
            success: false,
            error: 'Un compte existe déjà avec cet email. Veuillez contacter l\'administrateur pour réinitialiser votre mot de passe.'
          };
        }
      } else {
        throw authError; // Re-lancer l'erreur si ce n'est pas un problème d'email existant
      }
    }
    
    console.log('📧 Account email:', userCredential.user.email);
    
    // Mettre à jour l'employé dans Firestore avec les informations d'authentification
    console.log('🔄 Updating employee record in Firestore...');
    await updateDoc(employeeRef, {
      authId: userCredential.user.uid,
      hasDefaultPassword: true,
      defaultPasswordSet: true,
      passwordSetAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    console.log('✅ Employee record updated with authId');

    // Créer ou mettre à jour le document de profil utilisateur
    console.log('👤 Creating/updating user profile...');
    const userProfileRef = doc(db, 'user_profiles', userCredential.user.uid);
    await setDoc(userProfileRef, {
      employeeId: employeeData.employeeId,
      email: employeeData.email,
      role: 'employee',
      isEmployee: true,
      createdAt: new Date().toISOString()
    }, { merge: true });

    console.log('✅ User profile created/updated successfully');
    console.log('🎉 Employee account creation/update completed successfully');

    return {
      success: true,
      userId: userCredential.user.uid
    };
  } catch (error: any) {
    console.error('❌ Error creating employee account:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);
    
    // Gestion des erreurs spécifiques
    let errorMessage = 'Erreur lors de la création du compte';
    
    if (error.code === 'auth/weak-password') {
      errorMessage = 'Le mot de passe est trop faible (minimum 6 caractères)';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Adresse email invalide';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Nouvelle fonction pour vérifier et créer automatiquement un compte employé lors de la connexion
export const verifyAndCreateEmployeeLogin = async (email: string, defaultPassword: string = 'DefaultPass123!') => {
  try {
    console.log('🔍 Checking if employee exists for email:', email);
    
    // Rechercher l'employé par email
    const employeesQuery = query(
      collection(db, 'hr_employees'), 
      where('email', '==', email)
    );
    const employeeSnapshot = await getDocs(employeesQuery);
    
    if (employeeSnapshot.empty) {
      console.log('❌ No employee found with email:', email);
      return {
        success: false,
        error: 'Aucun employé trouvé avec cette adresse email'
      };
    }
    
    const employeeDoc = employeeSnapshot.docs[0];
    const employeeData = employeeDoc.data();
    const employeeId = employeeDoc.id;
    
    console.log('✅ Employee found:', {
      id: employeeId,
      name: `${employeeData.firstName} ${employeeData.lastName}`,
      email: employeeData.email,
      hasAuthId: !!employeeData.authId
    });
    
    // Si l'employé n'a pas encore d'authId, créer le compte
    if (!employeeData.authId) {
      console.log('🔧 Employee does not have authId, creating account...');
      
      const result = await createEmployeeAccount({
        employeeId: employeeId,
        email: email,
        password: defaultPassword
      });
      
      if (result.success) {
        console.log('✅ Employee account created successfully');
        return {
          success: true,
          message: `Compte créé avec succès. Mot de passe par défaut: ${defaultPassword}`,
          isNewAccount: true,
          defaultPassword: defaultPassword
        };
      } else {
        return result;
      }
    } else {
      console.log('ℹ️ Employee already has authId, account exists');
      return {
        success: true,
        message: 'Le compte employé existe déjà',
        isNewAccount: false
      };
    }
    
  } catch (error: any) {
    console.error('❌ Error in verifyAndCreateEmployeeLogin:', error);
    return {
      success: false,
      error: 'Erreur lors de la vérification du compte employé'
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
