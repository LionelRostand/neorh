
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, FileText } from 'lucide-react';
import { Employee } from '@/types/employee';

interface EmployeeHeaderProps {
  employee: Employee;
  onClose: () => void;
  onExportPDF: () => void;
}

// Utility function to get initials from name
export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Utility function to get status badge
export const getStatusBadge = (status: Employee['status']) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
    case 'onLeave':
      return <Badge className="bg-amber-500 hover:bg-amber-600">En congé</Badge>;
    case 'inactive':
      return <Badge className="bg-red-500 hover:bg-red-600">Inactif</Badge>;
    default:
      return <Badge>Inconnu</Badge>;
  }
};

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({ employee, onClose, onExportPDF }) => {
  return (
    <div className="flex justify-between items-start p-4 bg-gray-50">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={employee.photoUrl} alt={employee.name} />
          <AvatarFallback className="text-lg">{getInitials(employee.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          {getStatusBadge(employee.status)}
          <span className="text-lg font-medium mt-1">Employé</span>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4 mr-2" />
          Fermer
        </Button>
        <Button variant="outline" onClick={onExportPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Exporter PDF
        </Button>
      </div>
    </div>
  );
};

export default EmployeeHeader;
