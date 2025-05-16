
import React from "react";

interface EmployeeCellProps {
  employeeId: string;
  employeeName: string;
}

const EmployeeCell = ({ employeeId, employeeName }: EmployeeCellProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
        <span>
          {employeeName ? 
            employeeName.charAt(0).toUpperCase() : 
            employeeId.substring(0, 1).toUpperCase()}
        </span>
      </div>
      <div>
        <div className="font-medium">{employeeName || employeeId}</div>
        <div className="text-xs text-gray-500">{employeeId}</div>
      </div>
    </div>
  );
};

export default EmployeeCell;
