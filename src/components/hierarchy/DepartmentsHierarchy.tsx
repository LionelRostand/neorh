
import React, { useMemo } from "react";
import { useDepartmentsData } from "@/hooks/useDepartmentsData";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { Department } from "@/types/firebase";
import { Building2, ChevronDown, ChevronRight, User } from "lucide-react";

const DepartmentsHierarchy = () => {
  const { departments, isLoading, error } = useDepartmentsData();
  const { employees } = useEmployeeData();

  // Find departments without parent (root departments)
  const rootDepartments = useMemo(() => {
    if (!departments) return [];
    return departments.filter(dept => !dept.parentDepartmentId);
  }, [departments]);

  // Function to find child departments
  const findChildDepartments = (parentId: string) => {
    if (!departments) return [];
    return departments.filter(dept => dept.parentDepartmentId === parentId);
  };

  // Function to find department manager
  const findDepartmentManager = (managerId?: string) => {
    if (!managerId || !employees) return null;
    return employees.find(emp => emp.id === managerId);
  };

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

  if (!departments || departments.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Aucun département trouvé.</p>
      </div>
    );
  }

  const renderDepartment = (department: Department, level: number) => {
    const manager = findDepartmentManager(department.managerId);
    const childDepartments = findChildDepartments(department.id || "");
    const hasChildren = childDepartments.length > 0;

    // Calculate width based on the hierarchy level for pyramidal effect
    const getNodeWidth = () => {
      const baseWidth = 100; // percentage
      const reductionFactor = 8; // % narrower per level
      return `${Math.max(baseWidth - (level * reductionFactor), 60)}%`; // minimum 60% width
    };

    return (
      <div 
        key={department.id} 
        className="department-node mb-4"
        style={{ width: level === 0 ? '100%' : getNodeWidth() }}
      >
        <div 
          className={`p-4 rounded-md border ${level === 0 ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
          style={{ 
            borderLeft: department.color ? `4px solid ${department.color}` : undefined 
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${department.color ? `bg-opacity-20` : 'bg-gray-100'}`}
                   style={{ backgroundColor: department.color ? `${department.color}20` : undefined }}>
                <Building2 
                  className="w-6 h-6" 
                  style={{ color: department.color || '#6B7280' }} 
                />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-lg">{department.name}</h3>
                {department.description && (
                  <p className="text-sm text-gray-500">{department.description}</p>
                )}
              </div>
            </div>
            
            {manager && (
              <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                <div className="mr-2">
                  {manager.photoUrl ? (
                    <img src={manager.photoUrl} alt={manager.name} className="w-6 h-6 rounded-full" />
                  ) : (
                    <User className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                <div className="text-sm">
                  <span className="text-xs text-gray-500">Responsable:</span>
                  <p className="font-medium">{manager.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {hasChildren && (
          <div 
            className="children-container ml-8 pl-4 mt-2"
            style={{
              borderLeft: '1px dashed #ccc',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            {childDepartments.map(child => renderDepartment(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center overflow-auto py-8">
      {rootDepartments.length > 0 ? (
        <div className="hierarchy-tree w-full max-w-5xl">
          {rootDepartments.map(dept => renderDepartment(dept, 0))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p>Structure organisationnelle non définie</p>
          <p className="text-sm text-gray-500">Commencez par créer des départements racines</p>
        </div>
      )}
    </div>
  );
};

export default DepartmentsHierarchy;
