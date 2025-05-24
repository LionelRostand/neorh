
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ExtendedUser } from '@/types/auth';

export const enrichUserData = async (user: ExtendedUser): Promise<ExtendedUser> => {
  console.log('👤 User authenticated:', user.email);
  console.log('🆔 User UID:', user.uid);
  
  // Check if this is the admin email
  if (user.email === 'admin@neotech-consulting.com') {
    user.isAdmin = true;
    user.role = 'admin';
    console.log('🛡️ Admin user identified');
  } else {
    console.log('👨‍💼 Checking if user is an employee...');
    
    // Check if this is an employee by looking for their authId in hr_employees collection
    try {
      console.log('🔍 Searching employees by authId:', user.uid);
      const employeesQuery = query(
        collection(db, 'hr_employees'), 
        where('authId', '==', user.uid)
      );
      const employeeSnapshot = await getDocs(employeesQuery);
      
      if (!employeeSnapshot.empty) {
        const employeeDoc = employeeSnapshot.docs[0];
        const employeeData = employeeDoc.data();
        user.isEmployee = true;
        user.role = 'employee';
        user.employeeId = employeeDoc.id;
        console.log('✅ Employee found by authId:', {
          id: employeeDoc.id,
          name: `${employeeData.firstName} ${employeeData.lastName}`,
          email: employeeData.email
        });
      } else {
        console.log('❌ No employee found by authId, trying email search...');
        // Fallback: check by email
        const emailQuery = query(
          collection(db, 'hr_employees'), 
          where('email', '==', user.email)
        );
        const emailSnapshot = await getDocs(emailQuery);
        
        if (!emailSnapshot.empty) {
          const employeeDoc = emailSnapshot.docs[0];
          const employeeData = employeeDoc.data();
          user.isEmployee = true;
          user.role = 'employee';
          user.employeeId = employeeDoc.id;
          console.log('✅ Employee found by email:', {
            id: employeeDoc.id,
            name: `${employeeData.firstName} ${employeeData.lastName}`,
            email: employeeData.email
          });
          
          // Update the employee record with authId
          console.log('🔄 Updating employee record with authId...');
          await updateDoc(doc(db, 'hr_employees', employeeDoc.id), {
            authId: user.uid,
            updatedAt: new Date().toISOString()
          });
          console.log('✅ Employee record updated with authId');
        } else {
          console.log('❌ No employee found by email either');
          console.log('📧 Searched email:', user.email);
        }
      }
    } catch (err) {
      console.error('❌ Error checking employee status:', err);
    }
  }
  
  console.log('🏁 Final user object:', {
    email: user.email,
    isAdmin: user.isAdmin,
    isEmployee: user.isEmployee,
    role: user.role,
    employeeId: user.employeeId
  });
  
  return user;
};
