
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Employee } from '@/types/employee';

interface EmployeeStatusProps {
  status: Employee['status'];
}

const EmployeeStatus: React.FC<EmployeeStatusProps> = ({ status }) => {
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

export default EmployeeStatus;
