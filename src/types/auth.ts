
import { User } from 'firebase/auth';

// Extend the Firebase User type with our custom properties
export interface ExtendedUser extends User {
  isAdmin?: boolean;
  role?: string;
  employeeId?: string;
  isEmployee?: boolean;
}

export interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  error: string | null;
}
