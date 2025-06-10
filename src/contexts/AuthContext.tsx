
import { useState, useEffect, createContext, ReactNode } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ExtendedUser, AuthContextType } from '@/types/auth';
import { signInUser, signOutUser, changeUserPassword, enrichUserData, getAuthErrorMessage } from '@/services/authService';
import { sessionManager } from '@/services/auth/sessionService';

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
        // Créer une session unique pour cet utilisateur
        const sessionCreated = await sessionManager.createSession(extendedUser.uid);
        
        if (sessionCreated) {
          const enrichedUser = await enrichUserData(extendedUser);
          setUser(enrichedUser);
          
          // Mettre à jour l'activité périodiquement
          const activityInterval = setInterval(() => {
            sessionManager.updateActivity();
          }, 30000); // Toutes les 30 secondes

          // Nettoyer l'intervalle quand l'utilisateur se déconnecte
          return () => clearInterval(activityInterval);
        } else {
          // Échec de création de session - déconnecter
          await signOutUser();
          setUser(null);
        }
      } else {
        // Détruire la session lors de la déconnexion
        await sessionManager.destroySession();
        setUser(null);
      }
      
      setLoading(false);
    });

    // Nettoyer la session au déchargement de la page
    const handleBeforeUnload = () => {
      sessionManager.destroySession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
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
      await sessionManager.destroySession();
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
