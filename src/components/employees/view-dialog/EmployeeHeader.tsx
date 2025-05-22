
import React from 'react';
import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, FileDown, UserCircle } from "lucide-react";
import { Employee } from '@/types/employee';
import EmployeeAvatar from "@/components/common/EmployeeAvatar";

interface EmployeeHeaderProps {
  employee: Employee;
  onClose: () => void;
  onExportPDF: () => void;
  isExporting: boolean;
}

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({
  employee,
  onClose,
  onExportPDF,
  isExporting
}) => {
  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "actif":
      case "active":
        return "bg-green-500";
      case "inactif":
      case "inactive":
        return "bg-red-500";
      case "congé":
      case "leave":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <DialogHeader className="sticky top-0 z-10 bg-white p-6 pb-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {employee.photoURL ? (
            <img 
              src={employee.photoURL} 
              alt={`${employee.firstName} ${employee.lastName}`}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <UserCircle className="h-8 w-8 text-gray-400" />
            </div>
          )}
          
          <div>
            <DialogTitle className="text-xl font-semibold">
              {employee.firstName} {employee.lastName}
            </DialogTitle>
            
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`${getStatusColor(employee.status)}`}>
                {employee.status === "actif" || employee.status === "active" ? "Actif" : employee.status}
              </Badge>
              
              {employee.department && (
                <Badge variant="outline" className="font-normal">
                  {employee.department}
                </Badge>
              )}
              
              {employee.position && (
                <span className="text-sm text-gray-500">{employee.position}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportPDF}
            disabled={isExporting}
            className="flex items-center gap-1"
          >
            <FileDown className="h-4 w-4" />
            <span>{isExporting ? "Export..." : "Exporter PDF"}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </DialogHeader>
  );
};

export default EmployeeHeader;
