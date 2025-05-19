
import React from "react";

interface ManagerCellProps {
  managerId?: string;
  managerName?: string;
}

const ManagerCell = ({ managerId, managerName }: ManagerCellProps) => {
  if (!managerId) {
    return <span className="text-gray-400">-</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm">
        {managerName || managerId}
      </div>
    </div>
  );
};

export default ManagerCell;
