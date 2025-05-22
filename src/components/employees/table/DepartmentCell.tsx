import React, { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface DepartmentCellProps {
  departmentId: string;
  departmentName: string;
}

const DepartmentCell = ({ departmentId, departmentName }: DepartmentCellProps) => {
  const [displayName, setDisplayName] = useState<string>(departmentName || "");

  useEffect(() => {
    // If we already have a proper department name, use it
    if (departmentName && departmentName.trim() !== '') {
      setDisplayName(departmentName);
      return;
    }
    
    // Otherwise fetch the name from Firestore if we have an ID
    const fetchDepartmentName = async () => {
      if (!departmentId) return;
      
      try {
        const deptRef = doc(db, 'hr_departments', departmentId);
        const deptSnap = await getDoc(deptRef);
        
        if (deptSnap.exists()) {
          const deptData = deptSnap.data();
          setDisplayName(deptData.name || 'Département inconnu');
          console.log("Fetched department name:", deptData.name);
        } else {
          console.log("Department document not found for ID:", departmentId);
          setDisplayName('Département inconnu');
        }
      } catch (err) {
        console.error("Error fetching department name:", err);
        setDisplayName('Erreur de chargement');
      }
    };
    
    fetchDepartmentName();
  }, [departmentId, departmentName]);

  return (
    <div className="flex items-center">
      <Badge variant="outline" className="flex gap-1 items-center font-normal">
        <Building2 className="h-3 w-3 text-muted-foreground" />
        {displayName || "Département non assigné"}
      </Badge>
    </div>
  );
};

export default DepartmentCell;
