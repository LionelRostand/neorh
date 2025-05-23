
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
    // Si nous avons déjà un nom de département valide, utilisons-le
    if (departmentName && departmentName.trim() !== '' && !departmentName.includes('psUKm')) {
      setDisplayName(departmentName);
      return;
    }
    
    // Sinon, récupérer le nom depuis Firestore si nous avons un ID
    const fetchDepartmentName = async () => {
      if (!departmentId) {
        setDisplayName('Département non assigné');
        return;
      }
      
      setIsLoading(true);
      try {
        const deptRef = doc(db, HR.DEPARTMENTS, departmentId);
        const deptSnap = await getDoc(deptRef);
        
        if (deptSnap.exists()) {
          const deptData = deptSnap.data();
          setDisplayName(deptData.name || 'Département inconnu');
          console.log("Nom du département récupéré:", deptData.name, "pour l'ID:", departmentId);
        } else {
          console.log("Document de département non trouvé pour l'ID:", departmentId);
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
