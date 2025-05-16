
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Service pour récupérer les informations de l'employé
 */
export const employeeService = {
  /**
   * Récupérer les informations de l'employé, notamment son managerId
   */
  fetchEmployeeInfo: async (employeeId: string) => {
    try {
      const employeeRef = doc(db, 'hr_employees', employeeId);
      const employeeSnap = await getDoc(employeeRef);
      
      if (employeeSnap.exists()) {
        const employee = employeeSnap.data();
        return {
          employee,
          managerId: employee.managerId
        };
      }
      
      return { employee: null, managerId: undefined };
    } catch (err) {
      console.error("Erreur lors de la récupération des données de l'employé:", err);
      return { employee: null, managerId: undefined };
    }
  },
  
  /**
   * Récupère le nom du département à partir de son ID
   */
  fetchDepartmentName: async (departmentId: string) => {
    try {
      if (!departmentId) return 'Non spécifié';
      
      const deptRef = doc(db, 'hr_departments', departmentId);
      const deptSnap = await getDoc(deptRef);
      
      if (deptSnap.exists()) {
        const deptData = deptSnap.data();
        return deptData.name || 'Non spécifié';
      }
      
      return 'Non spécifié';
    } catch (err) {
      console.error("Erreur lors de la récupération du département:", err);
      return 'Non spécifié';
    }
  }
};
