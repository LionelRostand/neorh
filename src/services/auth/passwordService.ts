
import { getAuth, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ExtendedUser } from '@/types/auth';

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
