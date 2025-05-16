
import React from "react";
import { useDepartmentsData } from "@/hooks/useDepartmentsData";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { Department } from "@/types/firebase";
import { Building2, Users } from "lucide-react";

const DepartmentsHierarchy: React.FC = () => {
  const { departments, isLoading: isLoadingDepartments, error: deptError } = useDepartmentsData();
  const { employees, isLoading: isLoadingEmployees, error: empError } = useEmployeeData();

  if (isLoadingDepartments || isLoadingEmployees) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (deptError || empError) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <p className="text-red-500 font-medium">Erreur lors du chargement de la hiérarchie des départements</p>
          <p className="text-gray-500">Veuillez réessayer ultérieurement</p>
        </div>
      </div>
    );
  }

  if (!departments || departments.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Aucun département trouvé.</p>
      </div>
    );
  }

  // Group departments by their managers for hierarchical display
  const departmentsByManager: Record<string, Department[]> = {};
  
  // Find departments with no manager first (top level)
  const topLevelDepartments = departments.filter(dept => !dept.managerId);
  
  // Group other departments by their manager
  departments.forEach(dept => {
    if (dept.managerId) {
      if (!departmentsByManager[dept.managerId]) {
        departmentsByManager[dept.managerId] = [];
      }
      departmentsByManager[dept.managerId].push(dept);
    }
  });

  // Count employees per department
  const employeesPerDepartment: Record<string, number> = {};
  employees?.forEach(emp => {
    if (emp.departmentId) {
      employeesPerDepartment[emp.departmentId] = (employeesPerDepartment[emp.departmentId] || 0) + 1;
    }
  });

  // Render a department and its sub-departments
  const renderDepartment = (department: Department, level: number = 0) => {
    const managerInfo = department.managerId 
      ? employees?.find(emp => emp.id === department.managerId)
      : null;
      
    const subDepartments = departmentsByManager[department.id] || [];
    const employeeCount = employeesPerDepartment[department.id] || 0;
    
    // Calculate width for pyramidal effect
    const baseWidth = 100; // percentage
    const reductionFactor = 8; // % narrower per level
    const width = `${Math.max(baseWidth - (level * reductionFactor), 60)}%`; // minimum 60% width

    return (
      <div key={department.id} style={{ width: level === 0 ? '100%' : width }} className="mt-4">
        <div className={`p-4 rounded-md ${level === 0 ? 'bg-blue-50 border border-blue-200' : 'border border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${level === 0 ? 'bg-blue-100' : 'bg-primary/10'}`}>
                <Building2 className={`h-8 w-8 ${level === 0 ? 'text-blue-600' : 'text-primary'}`} />
              </div>
              <div className="ml-3">
                <h3 className={`font-medium ${level === 0 ? 'text-lg' : ''}`}>{department.name}</h3>
                <p className="text-sm text-gray-500">{department.description || "Aucune description"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {managerInfo && (
                <div className="flex items-center text-sm">
                  <div className="flex items-center bg-indigo-50 px-2 py-1 rounded-full">
                    <Users className="h-3.5 w-3.5 text-indigo-500 mr-1" />
                    <span className="text-indigo-700">Manager: {managerInfo.name}</span>
                  </div>
                </div>
              )}
              <div className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full">
                {employeeCount} {employeeCount <= 1 ? "employé" : "employés"}
              </div>
            </div>
          </div>
        </div>

        {/* Sub-departments */}
        {subDepartments.length > 0 && (
          <div 
            className="ml-8 pl-4 mt-2"
            style={{
              borderLeft: '1px dashed #ccc',
            }}
          >
            {subDepartments.map(subDept => renderDepartment(subDept, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="hierarchy-tree w-full max-w-5xl mx-auto">
      {topLevelDepartments.length > 0 ? (
        <>
          {topLevelDepartments.map(dept => renderDepartment(dept))}
        </>
      ) : (
        <div className="text-center py-8">
          <p>Structure départementale non définie</p>
          <p className="text-sm text-gray-500">Commencez par définir des départements de niveau supérieur</p>
        </div>
      )}
    </div>
  );
};

export default DepartmentsHierarchy;
