
import { 
  getAuth, 
  signInWithEmailAndPassword
} from 'firebase/auth';
import { verifyAndCreateEmployeeLogin } from '@/services/employeeAuthService';

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
