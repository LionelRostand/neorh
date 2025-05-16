
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const initializeAdminUser = async () => {
  try {
    const email = 'admin@neotech-consulting.com';
    const password = 'Admin@123';
    
    // Check if admin user exists in Firestore
    const userDoc = doc(db, 'users', 'admin');
    const userSnapshot = await getDoc(userDoc);
    
    if (!userSnapshot.exists()) {
      // Try to create the user in Firebase Authentication
      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Store user in Firestore
        await setDoc(userDoc, {
          uid: userCredential.user.uid,
          email: email,
          role: 'admin',
          isAdmin: true,
          createdAt: new Date().toISOString()
        });
        
        console.log("Admin user created successfully");
      } catch (error: any) {
        // If user already exists in Auth but not in Firestore
        if (error.code === 'auth/email-already-in-use') {
          // Just create the Firestore record
          await setDoc(userDoc, {
            email: email,
            role: 'admin',
            isAdmin: true,
            createdAt: new Date().toISOString()
          });
          console.log("Admin user record created in Firestore");
        } else {
          console.error("Error creating admin user:", error);
        }
      }
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
};
