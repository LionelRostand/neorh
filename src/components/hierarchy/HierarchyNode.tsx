
import React, { useState } from "react";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import { Employee } from "@/types/employee";

interface HierarchyNodeProps {
  employee: Employee;
  employees: Employee[];
  level: number;
  isLast?: boolean;
}

const HierarchyNode = ({ employee, employees, level, isLast = false }: HierarchyNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const directReports = employees.filter(emp => emp.managerId === employee.id);
  const hasChildren = directReports.length > 0;
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`hierarchy-node ${level > 0 ? 'ml-6' : ''}`}>
      <div 
        className="flex items-center p-2 rounded-md hover:bg-gray-50 transition-colors"
        style={{ marginBottom: hasChildren && isExpanded ? '12px' : '0' }}
      >
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
        
        <div className="bg-primary/10 p-1 rounded-full">
          {employee.photoUrl ? (
            <img 
              src={employee.photoUrl} 
              alt={employee.name} 
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <User className="w-8 h-8 text-primary" />
          )}
        </div>
        
        <div className="ml-3">
          <p className="font-medium">{employee.name}</p>
          <p className="text-xs text-gray-500">{employee.position}</p>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="children-container border-l ml-4 pl-2">
          {directReports.map((report, index) => (
            <HierarchyNode
              key={report.id}
              employee={report}
              employees={employees}
              level={level + 1}
              isLast={index === directReports.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HierarchyNode;
