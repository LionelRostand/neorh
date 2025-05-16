
import React, { useMemo } from "react";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import HierarchyNode from "./HierarchyNode";
import { Employee } from "@/types/employee";

interface EmployeesHierarchyProps {
  departmentFilter?: string;
}

const EmployeesHierarchy: React.FC<EmployeesHierarchyProps> = ({ departmentFilter = "all" }) => {
  const { employees, isLoading, error } = useEmployeeData();

  // Filtrer les employés par département si nécessaire
  const filteredEmployees = useMemo(() => {
    if (!employees || employees.length === 0) return [];
    
    if (departmentFilter === "all") {
      return employees;
    }
    
    return employees.filter(emp => emp.departmentId === departmentFilter);
  }, [employees, departmentFilter]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <p className="text-red-500 font-medium">Erreur lors du chargement de l'organigramme</p>
          <p className="text-gray-500">Veuillez réessayer ultérieurement</p>
        </div>
      </div>
    );
  }

  if (!filteredEmployees || filteredEmployees.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">
          {departmentFilter === "all" 
            ? "Aucune donnée hiérarchique trouvée."
            : "Aucun employé trouvé dans ce département."}
        </p>
      </div>
    );
  }

  // Trouver le CEO si on est en mode "all", sinon trouver le manager du département
  let rootEmployee: Employee | undefined;
  
  if (departmentFilter === "all") {
    // En mode global, on prend le CEO (sans manager)
    rootEmployee = filteredEmployees.find(emp => emp.managerId === undefined);
  } else {
    // Trouver le manager du département sélectionné
    // D'abord chercher les employés du département qui sont managers
    const departmentManagers = filteredEmployees.filter(emp => 
      !filteredEmployees.some(other => other.id === emp.managerId)
    );
    
    // Prendre le premier trouvé comme racine
    rootEmployee = departmentManagers.length > 0 ? departmentManagers[0] : filteredEmployees[0];
  }

  return (
    <div className="flex flex-col items-center overflow-auto">
      {rootEmployee ? (
        <div className="hierarchy-tree">
          <HierarchyNode 
            employee={rootEmployee} 
            employees={filteredEmployees} 
            level={0} 
          />
        </div>
      ) : (
        <div className="text-center py-8">
          <p>Structure organisationnelle non définie</p>
          <p className="text-sm text-gray-500">Commencez par définir un directeur général</p>
        </div>
      )}
    </div>
  );
};

export default EmployeesHierarchy;
