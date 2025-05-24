
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updatePassword
} from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Extend the Firebase User type with our custom properties
export interface ExtendedUser extends User {
  isAdmin?: boolean;
  role?: string;
  employeeId?: string;
  isEmployee?: boolean;
}

interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const extendedUser = user as ExtendedUser | null;
      
      if (extendedUser) {
        // Check if this is the admin email
        if (extendedUser.email === 'admin@neotech-consulting.com') {
          extendedUser.isAdmin = true;
          extendedUser.role = 'admin';
        } else {
          // Check if this is an employee
          try {
            const employeesRef = doc(db, 'hr_employees', extendedUser.uid);
            const employeeDoc = await getDoc(employeesRef);
            
            if (employeeDoc.exists()) {
              extendedUser.isEmployee = true;
              extendedUser.role = 'employee';
              extendedUser.employeeId = employeeDoc.id;
            }
          } catch (err) {
            console.error('Error checking employee status:', err);
          }
        }
      }
      
      setUser(extendedUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error('Error signing in:', err);
      setError('Email ou mot de passe incorrect.');
      throw err;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      const auth = getAuth();
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Une erreur est survenue lors de la déconnexion.');
      throw err;
    }
  };

  const changePassword = async (newPassword: string) => {
    setError(null);
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
      setError('Erreur lors du changement de mot de passe.');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, signIn, signOut, changePassword, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
