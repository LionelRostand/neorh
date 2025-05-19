
import React from "react";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DepartmentCellProps {
  departmentId: string;
  departmentName: string;
}

const DepartmentCell = ({ departmentId, departmentName }: DepartmentCellProps) => {
  return (
    <div className="flex items-center">
      <Badge variant="outline" className="flex gap-1 items-center font-normal">
        <Building2 className="h-3 w-3 text-muted-foreground" />
        {departmentName || "Département non assigné"}
      </Badge>
      {departmentId && (
        <span className="text-xs text-muted-foreground ml-2 hidden md:inline">
          {departmentId.substring(0, 6)}...
        </span>
      )}
    </div>
  );
};

export default DepartmentCell;
