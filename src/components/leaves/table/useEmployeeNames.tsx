
import { useState, useEffect } from "react";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Leave } from "@/types/firebase";
import { HR } from "@/lib/constants/collections";

export const useEmployeeNames = (leaves: Leave[]) => {
  const [employeeNames, setEmployeeNames] = useState<Record<string, string>>({});
  const [managerNames, setManagerNames] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Charger les noms des employés et des managers
  useEffect(() => {
    const fetchEmployeeAndManagerNames = async () => {
      setIsLoading(true);
      
      // Récupérer les IDs uniques des employés et managers
      const empIds = [...new Set(leaves.map(leave => leave.employeeId))];
      const mgrIds = [...new Set(leaves.map(leave => leave.managerId).filter(Boolean))];
      
      // Combiner tous les IDs pour une requête unique
      const allIds = [...new Set([...empIds, ...mgrIds.filter(Boolean) as string[]])];
      
      if (allIds.length === 0) {
        setIsLoading(false);
        return;
      }
      
      const empNamesMap: Record<string, string> = {};
      const mgrNamesMap: Record<string, string> = {};
      
      // Utiliser une requête batch si possible
      try {
        // Diviser en lots de 10 IDs maximum pour éviter les limites de Firestore
        const batchSize = 10;
        for (let i = 0; i < allIds.length; i += batchSize) {
          const batch = allIds.slice(i, i + batchSize);
          
          const q = query(collection(db, HR.EMPLOYEES), where('__name__', 'in', batch));
          const querySnapshot = await getDocs(q);
          
          querySnapshot.forEach(doc => {
            const data = doc.data();
            const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
            
            // Stocker dans les deux maps si nécessaire
            if (empIds.includes(doc.id)) {
              empNamesMap[doc.id] = fullName;
            }
            
            if (mgrIds.includes(doc.id)) {
              mgrNamesMap[doc.id] = fullName;
            }
          });
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des noms par lots:", err);
        
        // Fallback: récupérer individuellement
        for (const id of allIds) {
          if (!id) continue;
          
          try {
            const docRef = await getDoc(doc(db, HR.EMPLOYEES, id));
            if (docRef.exists()) {
              const data = docRef.data();
              const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
              
              if (empIds.includes(id)) {
                empNamesMap[id] = fullName;
              }
              
              if (mgrIds.includes(id)) {
                mgrNamesMap[id] = fullName;
              }
            }
          } catch (err) {
            console.error(`Erreur lors du chargement de l'employé ${id}:`, err);
          }
        }
      }
      
      setEmployeeNames(empNamesMap);
      setManagerNames(mgrNamesMap);
      setIsLoading(false);
    };
    
    if (leaves.length > 0) {
      fetchEmployeeAndManagerNames();
    } else {
      setIsLoading(false);
    }
  }, [leaves]);

  return { employeeNames, managerNames, isLoading };
};

export default useEmployeeNames;
