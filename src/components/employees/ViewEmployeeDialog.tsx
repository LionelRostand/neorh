
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Employee } from '@/types/employee';
import { Calendar, Building2, Mail, Phone, Briefcase, Calendar as CalendarIcon } from 'lucide-react';

interface ViewEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

const ViewEmployeeDialog: React.FC<ViewEmployeeDialogProps> = ({
  open,
  onOpenChange,
  employee
}) => {
  if (!employee) return null;
  
  const getStatusBadge = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>;
      case 'onLeave':
        return <Badge className="bg-amber-500 hover:bg-amber-600">En congé</Badge>;
      case 'inactive':
        return <Badge className="bg-red-500 hover:bg-red-600">Inactif</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails de l'employé</DialogTitle>
          <DialogDescription>
            Informations complètes sur {employee.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={employee.photoUrl} alt={employee.name} />
            <AvatarFallback className="text-lg">{getInitials(employee.name)}</AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <h3 className="text-xl font-bold">{employee.name}</h3>
            <p className="text-muted-foreground">{employee.position}</p>
            {getStatusBadge(employee.status)}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Email:</span>
            <span>{employee.email}</span>
          </div>
          
          {employee.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Téléphone:</span>
              <span>{employee.phone}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Poste:</span>
            <span>{employee.position}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Département:</span>
            <span>{employee.department}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Date d'embauche:</span>
            <span>{employee.startDate}</span>
          </div>
          
          {employee.managerId && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Manager ID:</span>
              <span>{employee.managerId}</span>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewEmployeeDialog;
