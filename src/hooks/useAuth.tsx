
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';

// Extend the Firebase User type with our custom properties
export interface ExtendedUser extends User {
  isAdmin?: boolean;
  role?: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Cast the user to our extended type
      const extendedUser = user as ExtendedUser | null;
      
      // If this is the admin email, set isAdmin to true
      if (extendedUser && extendedUser.email === 'admin@neotech-consulting.com') {
        extendedUser.isAdmin = true;
        extendedUser.role = 'admin';
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

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, signIn, signOut, error }}>
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
