
import { Employee as FirebaseEmployee } from "@/types/firebase";
import { Employee as AppEmployee } from "@/types/employee";

/**
 * Converts Firebase employee format to application employee format
 */
export const adaptFirebaseEmployee = (fbEmployee: FirebaseEmployee): AppEmployee => {
  return {
    id: fbEmployee.id || "",
    name: `${fbEmployee.firstName || ''} ${fbEmployee.lastName || ''}`.trim(),
    position: fbEmployee.position || "",
    department: fbEmployee.department || "",
    email: fbEmployee.email || "",
    phone: fbEmployee.phone || "",
    photoUrl: fbEmployee.avatarUrl,
    startDate: fbEmployee.hireDate || "",
    status: fbEmployee.status === "terminated" ? "inactive" : 
           (fbEmployee.status === "onLeave" ? "onLeave" : "active"),
  };
};

/**
 * Adapts application employee format to Firebase employee format
 */
export const adaptAppEmployee = (appEmployee: AppEmployee): Partial<FirebaseEmployee> => {
  const [firstName = "", lastName = ""] = (appEmployee.name || "").split(" ");
  
  return {
    id: appEmployee.id,
    firstName,
    lastName,
    position: appEmployee.position,
    department: appEmployee.department,
    email: appEmployee.email,
    phone: appEmployee.phone,
    avatarUrl: appEmployee.photoUrl,
    hireDate: appEmployee.startDate,
    status: appEmployee.status === "inactive" ? "terminated" : 
           (appEmployee.status === "onLeave" ? "onLeave" : "active"),
  };
};
