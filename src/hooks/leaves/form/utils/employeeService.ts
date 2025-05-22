
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
  }
};
