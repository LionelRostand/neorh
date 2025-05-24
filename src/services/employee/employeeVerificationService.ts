
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { VerifyEmployeeLoginResult } from '@/types/employeeAuth';
import { createEmployeeAccount } from './employeeAccountService';

export const verifyAndCreateEmployeeLogin = async (
  email: string, 
  defaultPassword: string = 'DefaultPass123!'
): Promise<VerifyEmployeeLoginResult> => {
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
        return {
          success: false,
          error: result.error
        };
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
