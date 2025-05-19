
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface EmployeeCellProps {
  employeeId: string;
  employeeName: string;
}

const EmployeeCell = ({ employeeId, employeeName }: EmployeeCellProps) => {
  // Get initials from employee name or first letter of ID
  const getInitials = () => {
    if (employeeName) {
      return employeeName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return employeeId.charAt(0).toUpperCase();
  };

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8 bg-primary/10">
        <AvatarFallback className="text-xs font-medium">
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">{employeeName || "Employé inconnu"}</div>
        <div className="text-xs text-muted-foreground">{employeeId}</div>
      </div>
    </div>
  );
};

export default EmployeeCell;
