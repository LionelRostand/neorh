
import React from "react";
import { User } from "lucide-react";

interface ManagerCellProps {
  managerId?: string;
  managerName?: string;
}

const ManagerCell = ({ managerId, managerName }: ManagerCellProps) => {
  if (!managerId) {
    return <span className="text-gray-400">Non assigné</span>;
  }
  
  return (
    <div className="flex items-center gap-2">
      <User className="h-4 w-4 text-gray-500" />
      <span>{managerName || managerId}</span>
    </div>
  );
};

export default ManagerCell;
