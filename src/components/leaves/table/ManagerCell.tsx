
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ManagerCellProps {
  managerId?: string;
  managerName?: string;
}

const ManagerCell = ({ managerId, managerName }: ManagerCellProps) => {
  if (!managerId) {
    return <span className="text-muted-foreground text-sm">Non assigné</span>;
  }

  // Get initials from manager name or first letter of ID
  const getInitials = () => {
    if (managerName) {
      return managerName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return managerId.charAt(0).toUpperCase();
  };

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6 bg-secondary/30">
        <AvatarFallback className="text-xs">
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="text-sm">{managerName || "Manager inconnu"}</div>
      </div>
    </div>
  );
};

export default ManagerCell;
