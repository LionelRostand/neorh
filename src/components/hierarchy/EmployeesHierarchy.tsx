
import React, { useMemo } from "react";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import HierarchyNode from "./HierarchyNode";
import { Employee } from "@/types/employee";

interface EmployeesHierarchyProps {
  departmentFilter?: string;
}

const EmployeesHierarchy: React.FC<EmployeesHierarchyProps> = ({ departmentFilter = "all" }) => {
  const { employees, isLoading, error } = useEmployeeData();

  // Filter employees by department if necessary
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

  // Find the CEO if in "all" mode, otherwise find the department manager
  let rootEmployee: Employee | undefined;
  
  if (departmentFilter === "all") {
    // In global mode, take the CEO (without manager)
    rootEmployee = filteredEmployees.find(emp => emp.managerId === undefined);
  } else {
    // Find the manager of the selected department
    // First look for department employees who are managers
    const departmentManagers = filteredEmployees.filter(emp => 
      !filteredEmployees.some(other => other.id === emp.managerId)
    );
    
    // Take the first one found as root
    rootEmployee = departmentManagers.length > 0 ? departmentManagers[0] : filteredEmployees[0];
  }

  return (
    <div className="flex flex-col items-center overflow-auto py-8">
      {rootEmployee ? (
        <div className="hierarchy-tree w-full max-w-5xl">
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
