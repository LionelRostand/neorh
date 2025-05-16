
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Extend the Firebase User type with our custom properties
interface ExtendedUser extends firebase.User {
  isAdmin?: boolean;
  role?: string;
}

export function useAuth() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Cast the user to our extended type
      const extendedUser = user as ExtendedUser | null;
      setUser(extendedUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}
