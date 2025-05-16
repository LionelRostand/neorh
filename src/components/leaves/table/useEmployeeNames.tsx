
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Leave } from "@/lib/constants";

export const useEmployeeNames = (leaves: Leave[]) => {
  const [employeeNames, setEmployeeNames] = useState<Record<string, string>>({});
  const [managerNames, setManagerNames] = useState<Record<string, string>>({});
  
  // Charger les noms des employés et des managers
  useEffect(() => {
    const fetchEmployeeAndManagerNames = async () => {
      const empIds = [...new Set(leaves.map(leave => leave.employeeId))];
      const mgrIds = [...new Set(leaves.map(leave => leave.managerId).filter(Boolean))];
      
      const empNamesMap: Record<string, string> = {};
      const mgrNamesMap: Record<string, string> = {};
      
      // Récupérer les noms des employés
      for (const empId of empIds) {
        try {
          const empDoc = await getDoc(doc(db, 'hr_employees', empId));
          if (empDoc.exists()) {
            const data = empDoc.data();
            empNamesMap[empId] = `${data.firstName || ''} ${data.lastName || ''}`.trim();
          }
        } catch (err) {
          console.error(`Erreur lors du chargement de l'employé ${empId}:`, err);
        }
      }
      
      // Récupérer les noms des managers
      for (const mgrId of mgrIds) {
        if (!mgrId) continue;
        try {
          const mgrDoc = await getDoc(doc(db, 'hr_employees', mgrId));
          if (mgrDoc.exists()) {
            const data = mgrDoc.data();
            mgrNamesMap[mgrId] = `${data.firstName || ''} ${data.lastName || ''}`.trim();
          }
        } catch (err) {
          console.error(`Erreur lors du chargement du manager ${mgrId}:`, err);
        }
      }
      
      setEmployeeNames(empNamesMap);
      setManagerNames(mgrNamesMap);
    };
    
    if (leaves.length > 0) {
      fetchEmployeeAndManagerNames();
    }
  }, [leaves]);

  return { employeeNames, managerNames };
};

export default useEmployeeNames;
