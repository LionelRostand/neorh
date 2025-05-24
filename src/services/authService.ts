
import { 
  getAuth, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updatePassword
} from 'firebase/auth';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { verifyAndCreateEmployeeLogin } from '@/services/employeeAuthService';
import { ExtendedUser } from '@/types/auth';

export const signInUser = async (email: string, password: string) => {
  console.log('🚀 Attempting sign in with:', email);
  const auth = getAuth();
  
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Sign in successful for:', result.user.email);
    console.log('🆔 User UID:', result.user.uid);
    return result;
  } catch (authError: any) {
    console.log('❌ Initial sign in failed:', authError.code);
    
    // Si c'est un employé qui n'a pas encore de compte, essayer de le créer
    if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
      console.log('🔍 Checking if this is an employee without account...');
      
      const employeeCheck = await verifyAndCreateEmployeeLogin(email, password);
      
      if (employeeCheck.success && 'isNewAccount' in employeeCheck && employeeCheck.isNewAccount) {
        // Le compte a été créé, essayer de se connecter maintenant
        console.log('🔄 Account created, attempting login...');
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ Sign in successful after account creation:', result.user.email);
        return { ...result, isNewAccount: true };
      } else if (employeeCheck.success && 'isNewAccount' in employeeCheck && !employeeCheck.isNewAccount) {
        // Le compte existe mais le mot de passe est incorrect
        throw authError;
      } else {
        // Pas un employé ou erreur lors de la création
        throw authError;
      }
    } else {
      throw authError;
    }
  }
};

export const signOutUser = async () => {
  try {
    const auth = getAuth();
    await firebaseSignOut(auth);
  } catch (err) {
    console.error('Error signing out:', err);
    throw err;
  }
};

export const changeUserPassword = async (newPassword: string, user: ExtendedUser | null) => {
  try {
    const auth = getAuth();
    if (auth.currentUser) {
      await updatePassword(auth.currentUser, newPassword);
      
      // Update employee record to remove default password flag
      if (user?.employeeId) {
        const employeeRef = doc(db, 'hr_employees', user.employeeId);
        await updateDoc(employeeRef, {
          hasDefaultPassword: false,
          lastPasswordChange: new Date().toISOString()
        });
      }
    }
  } catch (err) {
    console.error('Error changing password:', err);
    throw err;
  }
};

export const enrichUserData = async (user: ExtendedUser): Promise<ExtendedUser> => {
  console.log('👤 User authenticated:', user.email);
  console.log('🆔 User UID:', user.uid);
  
  // Check if this is the admin email
  if (user.email === 'admin@neotech-consulting.com') {
    user.isAdmin = true;
    user.role = 'admin';
    console.log('🛡️ Admin user identified');
  } else {
    console.log('👨‍💼 Checking if user is an employee...');
    
    // Check if this is an employee by looking for their authId in hr_employees collection
    try {
      console.log('🔍 Searching employees by authId:', user.uid);
      const employeesQuery = query(
        collection(db, 'hr_employees'), 
        where('authId', '==', user.uid)
      );
      const employeeSnapshot = await getDocs(employeesQuery);
      
      if (!employeeSnapshot.empty) {
        const employeeDoc = employeeSnapshot.docs[0];
        const employeeData = employeeDoc.data();
        user.isEmployee = true;
        user.role = 'employee';
        user.employeeId = employeeDoc.id;
        console.log('✅ Employee found by authId:', {
          id: employeeDoc.id,
          name: `${employeeData.firstName} ${employeeData.lastName}`,
          email: employeeData.email
        });
      } else {
        console.log('❌ No employee found by authId, trying email search...');
        // Fallback: check by email
        const emailQuery = query(
          collection(db, 'hr_employees'), 
          where('email', '==', user.email)
        );
        const emailSnapshot = await getDocs(emailQuery);
        
        if (!emailSnapshot.empty) {
          const employeeDoc = emailSnapshot.docs[0];
          const employeeData = emailSnapshot.data();
          user.isEmployee = true;
          user.role = 'employee';
          user.employeeId = employeeDoc.id;
          console.log('✅ Employee found by email:', {
            id: employeeDoc.id,
            name: `${employeeData.firstName} ${employeeData.lastName}`,
            email: employeeData.email
          });
          
          // Update the employee record with authId
          console.log('🔄 Updating employee record with authId...');
          await updateDoc(doc(db, 'hr_employees', employeeDoc.id), {
            authId: user.uid,
            updatedAt: new Date().toISOString()
          });
          console.log('✅ Employee record updated with authId');
        } else {
          console.log('❌ No employee found by email either');
          console.log('📧 Searched email:', user.email);
        }
      }
    } catch (err) {
      console.error('❌ Error checking employee status:', err);
    }
  }
  
  console.log('🏁 Final user object:', {
    email: user.email,
    isAdmin: user.isAdmin,
    isEmployee: user.isEmployee,
    role: user.role,
    employeeId: user.employeeId
  });
  
  return user;
};

export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Aucun compte trouvé avec cette adresse email.';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect.';
    case 'auth/invalid-email':
      return 'Adresse email invalide.';
    case 'auth/user-disabled':
      return 'Ce compte a été désactivé.';
    case 'auth/invalid-credential':
      return 'Identifiants invalides. Vérifiez votre email et mot de passe.';
    default:
      return 'Email ou mot de passe incorrect.';
  }
};
