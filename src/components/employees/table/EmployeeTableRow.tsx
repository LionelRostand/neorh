import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Calendar } from 'lucide-react';
import { Employee } from '@/types/employee';
import EmployeeStatus from './EmployeeStatus';
import EmployeeActions from './EmployeeActions';
import DepartmentCell from './DepartmentCell';

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

// Get photo URL - prioritize photoBase64 from database, then fallback to photoUrl
const getPhotoUrl = (employee: Employee) => {
  // Check if we have base64 photo data from database
  if ((employee as any).photoBase64) {
    // If it already includes the data URL prefix, use as is
    if ((employee as any).photoBase64.startsWith('data:')) {
      return (employee as any).photoBase64;
    }
    // Otherwise, add the data URL prefix
    return `data:image/jpeg;base64,${(employee as any).photoBase64}`;
  }
  
  // Fallback to regular photoUrl
  return employee.photoUrl;
};

const EmployeeTableRow: React.FC<EmployeeTableRowProps> = ({
  employee,
  handleEdit,
  handleDelete,
  handleView
}) => {
  const photoUrl = getPhotoUrl(employee);

  return (
    <TableRow key={employee.id}>
      <TableCell>
        <Avatar>
          <AvatarImage src={photoUrl} />
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
          {employee.professionalEmail || employee.email}
        </div>
        <div className="md:hidden flex items-center mt-1">
          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
          {employee.phone}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <DepartmentCell 
          departmentId={employee.departmentId || ''} 
          departmentName={employee.department || ''}
        />
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
