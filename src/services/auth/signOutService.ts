
import { getAuth, signOut as firebaseSignOut } from 'firebase/auth';

export const signOutUser = async () => {
  try {
    const auth = getAuth();
    await firebaseSignOut(auth);
  } catch (err) {
    console.error('Error signing out:', err);
    throw err;
  }
};
