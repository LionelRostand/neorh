
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HR } from "@/lib/constants/collections";

/**
 * Service pour gérer les opérations liées aux employés
 */
export const employeeService = {
  /**
   * Récupérer les informations de l'employé et son manager
   */
  fetchEmployeeInfo: async (employeeId: string): Promise<{
    employee: { name: string } | null;
    managerId: string | undefined;
  }> => {
    try {
      // Récupérer l'employé
      const employeeRef = doc(db, HR.EMPLOYEES, employeeId);
      const employeeSnap = await getDoc(employeeRef);
      
      if (!employeeSnap.exists()) {
        return { employee: null, managerId: undefined };
      }
      
      const employeeData = employeeSnap.data();
      const managerId = employeeData.managerId;
      
      // Former le nom complet de l'employé
      const name = `${employeeData.firstName || ''} ${employeeData.lastName || ''}`.trim();
      
      return {
        employee: { name },
        managerId
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de l\'employé:', error);
      return { employee: null, managerId: undefined };
    }
  },

  /**
   * Récupérer le nom d'un département à partir de son ID
   */
  fetchDepartmentName: async (departmentId: string): Promise<string> => {
    try {
      if (!departmentId) {
        return 'Non spécifié';
      }
      
      // Récupérer le département
      const deptRef = doc(db, HR.DEPARTMENTS, departmentId);
      const deptSnap = await getDoc(deptRef);
      
      if (!deptSnap.exists()) {
        return 'Département inconnu';
      }
      
      const deptData = deptSnap.data();
      return deptData.name || 'Sans nom';
    } catch (error) {
      console.error('Erreur lors de la récupération du nom du département:', error);
      return 'Erreur de chargement';
    }
  }
};
