
import { useState, useEffect, createContext, ReactNode } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ExtendedUser, AuthContextType } from '@/types/auth';
import { signInUser, signOutUser, changeUserPassword, enrichUserData, getAuthErrorMessage } from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔐 Auth state changed:', user?.email || 'No user');
      const extendedUser = user as ExtendedUser | null;
      
      if (extendedUser) {
        const enrichedUser = await enrichUserData(extendedUser);
        setUser(enrichedUser);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const result = await signInUser(email, password);
      if ('isNewAccount' in result && result.isNewAccount) {
        setError(`Compte créé avec succès. Vous êtes maintenant connecté.`);
      }
    } catch (err: any) {
      console.error('❌ Error signing in:', err);
      console.error('❌ Error code:', err.code);
      console.error('❌ Error message:', err.message);
      
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      throw err;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await signOutUser();
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Une erreur est survenue lors de la déconnexion.');
      throw err;
    }
  };

  const changePassword = async (newPassword: string) => {
    setError(null);
    try {
      await changeUserPassword(newPassword, user);
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

export { AuthContext };
