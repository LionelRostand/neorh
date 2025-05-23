
import React, { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HR } from "@/lib/constants/collections";

interface DepartmentCellProps {
  departmentId: string;
  departmentName: string;
}

const DepartmentCell = ({ departmentId, departmentName }: DepartmentCellProps) => {
  const [displayName, setDisplayName] = useState<string>(departmentName || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Si nous avons un nom de département qui ne ressemble pas à un ID, utilisons-le
    if (departmentName && 
        departmentName.trim() !== '' && 
        !departmentName.includes('mbKdw') && 
        !departmentName.includes('psUKm') &&
        departmentName.length < 20) { // Les vrais noms de département sont généralement plus courts
      setDisplayName(departmentName);
      return;
    }
    
    // Déterminer quel ID utiliser pour récupérer le département
    let idToFetch = '';
    if (departmentId && departmentId.trim() !== '') {
      idToFetch = departmentId;
    } else if (departmentName && (departmentName.includes('mbKdw') || departmentName.includes('psUKm'))) {
      // Le nom du département est en fait un ID
      idToFetch = departmentName;
    }
    
    if (!idToFetch) {
      setDisplayName('Département non assigné');
      return;
    }
    
    // Récupérer le nom depuis Firestore
    const fetchDepartmentName = async () => {
      setIsLoading(true);
      try {
        const deptRef = doc(db, HR.DEPARTMENTS, idToFetch);
        const deptSnap = await getDoc(deptRef);
        
        if (deptSnap.exists()) {
          const deptData = deptSnap.data();
          const fetchedName = deptData.name || 'Département inconnu';
          setDisplayName(fetchedName);
          console.log("Nom du département récupéré:", fetchedName, "pour l'ID:", idToFetch);
        } else {
          console.log("Document de département non trouvé pour l'ID:", idToFetch);
          setDisplayName('Département inconnu');
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du nom du département:", err);
        setDisplayName('Erreur de chargement');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDepartmentName();
  }, [departmentId, departmentName]);

  return (
    <div className="flex items-center">
      <Badge variant="outline" className="flex gap-1 items-center font-normal">
        <Building2 className="h-3 w-3 text-muted-foreground" />
        {isLoading ? "Chargement..." : displayName || "Département non assigné"}
      </Badge>
    </div>
  );
};

export default DepartmentCell;
