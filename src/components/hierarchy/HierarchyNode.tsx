
import React, { useState } from "react";
import { ChevronDown, ChevronRight, User, Building2 } from "lucide-react";
import { Employee } from "@/types/employee";
import { useDepartmentsData } from "@/hooks/useDepartmentsData";

interface HierarchyNodeProps {
  employee: Employee;
  employees: Employee[];
  level: number;
  isLast?: boolean;
  showDepartments?: boolean;
}

const HierarchyNode = ({ 
  employee, 
  employees, 
  level, 
  isLast = false,
  showDepartments = false 
}: HierarchyNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDeptsExpanded, setIsDeptsExpanded] = useState(false);
  const { departments } = useDepartmentsData();
  
  const directReports = employees.filter(emp => emp.managerId === employee.id);
  const hasChildren = directReports.length > 0;
  
  // Find departments where this employee is the manager
  const managedDepartments = departments?.filter(dept => dept.managerId === employee.id) || [];
  const hasManagedDepartments = managedDepartments.length > 0;
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDeptExpand = () => {
    setIsDeptsExpanded(!isDeptsExpanded);
  };

  // Calculate width based on the hierarchy level for pyramidal effect
  const getNodeWidth = () => {
    const baseWidth = 100; // percentage
    const reductionFactor = 8; // % narrower per level
    return `${Math.max(baseWidth - (level * reductionFactor), 60)}%`; // minimum 60% width
  };

  // Check if employee is the CEO (top-level)
  const isCEO = level === 0;

  return (
    <div className={`hierarchy-node ${level > 0 ? 'ml-6' : ''}`} style={{ width: level === 0 ? '100%' : getNodeWidth() }}>
      <div 
        className={`flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors ${
          isCEO ? 'bg-blue-50 border border-blue-200' : 'border border-gray-200'
        }`}
        style={{ marginBottom: hasChildren && isExpanded ? '12px' : '0' }}
      >
        {/* Left section with icon/photo */}
        {hasChildren ? (
          <button 
            onClick={toggleExpand} 
            className="p-1 rounded-full hover:bg-gray-200 mr-2"
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <div className="w-[28px] mr-2"></div>
        )}
        
        <div className={`p-1 rounded-full ${isCEO ? 'bg-blue-100' : 'bg-primary/10'}`}>
          {employee.photoUrl ? (
            <img 
              src={employee.photoUrl} 
              alt={employee.name} 
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <User className={`w-8 h-8 ${isCEO ? 'text-blue-600' : 'text-primary'}`} />
          )}
        </div>
        
        {/* Center section with employee details */}
        <div className="ml-3 flex-1">
          {isCEO && employee.position === "Directeur Général" ? (
            <p className="font-medium text-lg">Direction Générale</p>
          ) : (
            <p className={`font-medium ${isCEO ? 'text-lg' : ''}`}>{employee.name}</p>
          )}
          <div className="flex items-center text-xs text-gray-500">
            <span>{employee.position}</span>
            {employee.department && (
              <div className="flex items-center ml-2 bg-gray-100 px-2 py-0.5 rounded-full">
                <Building2 className="h-3 w-3 mr-1" />
                <span>{employee.department}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Right section - Responsible info for CEO */}
        {isCEO && (
          <div className="flex items-center">
            <div className="text-right">
              <p className="text-xs text-gray-500">Responsable:</p>
              <p className="text-sm font-medium">{employee.name}</p>
            </div>
            <div className="ml-2">
              {employee.photoUrl ? (
                <img 
                  src={employee.photoUrl} 
                  alt={employee.name} 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Right section - Stats and buttons */}
        {!isCEO && (
          <div className="flex space-x-2">
            {showDepartments && hasManagedDepartments && (
              <button
                onClick={toggleDeptExpand}
                className={`flex items-center text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 hover:bg-indigo-200`}
              >
                <Building2 className="h-3 w-3 mr-1" />
                {isDeptsExpanded ? "Masquer dép." : "Voir dép."}
                <span className="ml-1">({managedDepartments.length})</span>
              </button>
            )}
            
            {directReports.length > 0 && (
              <div className={`${isCEO ? 'bg-blue-100 text-blue-800' : 'bg-primary/10 text-primary'} text-xs px-2 py-0.5 rounded-full`}>
                {directReports.length} {directReports.length === 1 ? 'membre' : 'membres'}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Show managed departments if expanded */}
      {showDepartments && hasManagedDepartments && isDeptsExpanded && (
        <div className="ml-8 mt-2 pl-4 border-l border-dashed border-indigo-200">
          {managedDepartments.map((dept, index) => (
            <div key={dept.id} className="mb-2 p-2 bg-indigo-50 border border-indigo-100 rounded-md">
              <div className="flex items-center">
                <div className="p-1 rounded-full bg-indigo-100">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-2">
                  <p className="font-medium text-sm">{dept.name}</p>
                  {dept.description && (
                    <p className="text-xs text-gray-500">{dept.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Show employee hierarchy if expanded */}
      {hasChildren && isExpanded && (
        <div 
          className="children-container ml-4 pl-2"
          style={{
            borderLeft: '1px dashed #ccc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {directReports.map((report, index) => (
            <HierarchyNode
              key={report.id}
              employee={report}
              employees={employees}
              level={level + 1}
              isLast={index === directReports.length - 1}
              showDepartments={showDepartments}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HierarchyNode;
