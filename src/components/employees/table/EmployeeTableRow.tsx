
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Building2, Calendar } from 'lucide-react';
import { Employee } from '@/types/employee';
import EmployeeStatus from './EmployeeStatus';
import EmployeeActions from './EmployeeActions';

interface EmployeeTableRowProps {
  employee: Employee;
  handleEdit: (employeeId: string) => void;
  handleDelete: (employeeId: string) => void;
  handleView: (employeeId: string) => void;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const EmployeeTableRow: React.FC<EmployeeTableRowProps> = ({
  employee,
  handleEdit,
  handleDelete,
  handleView
}) => {
  return (
    <TableRow key={employee.id}>
      <TableCell>
        <Avatar>
          <AvatarImage src={employee.photoUrl} />
          <AvatarFallback>{getInitials(employee.name || '')}</AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="font-medium">
        {employee.name}
        <div className="text-sm text-muted-foreground md:hidden">
          {employee.position}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
          {employee.email}
        </div>
        <div className="md:hidden flex items-center mt-1">
          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
          {employee.phone}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center">
          <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
          {employee.department || 'Non assigné'}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <EmployeeStatus status={employee.status} />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          {employee.startDate}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <EmployeeActions
          employeeId={employee.id}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleView={handleView}
        />
      </TableCell>
    </TableRow>
  );
};

export default EmployeeTableRow;
