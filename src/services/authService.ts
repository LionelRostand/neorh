
// Main authentication service - exports all auth functionality
export { signInUser } from './auth/signInService';
export { signOutUser } from './auth/signOutService';
export { changeUserPassword } from './auth/passwordService';
export { enrichUserData } from './auth/userEnrichmentService';
export { getAuthErrorMessage } from './auth/errorService';

// Re-export types for convenience
export type { ExtendedUser } from '@/types/auth';
