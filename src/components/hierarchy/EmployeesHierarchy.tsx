
import React from "react";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import HierarchyNode from "./HierarchyNode";

const EmployeesHierarchy = () => {
  const { data: employees, isLoading, error } = useEmployeeData();

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

  if (!employees || employees.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Aucune donnée hiérarchique trouvée.</p>
      </div>
    );
  }

  const ceo = employees.find(emp => emp.position === "CEO");

  return (
    <div className="flex flex-col items-center overflow-auto">
      {ceo ? (
        <div className="hierarchy-tree">
          <HierarchyNode employee={ceo} employees={employees} level={0} />
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
