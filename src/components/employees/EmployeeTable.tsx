
import React from 'react';
import {
  Edit,
  Trash2,
  Download,
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
  Calendar
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { Employee } from '@/types/employee';

interface EmployeeTableProps {
  employees: Employee[];
  currentPage: number;
  pageSize: number;
  sortField: keyof Employee;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: keyof Employee) => void;
  handleEdit: (employeeId: string) => void;
  handleDelete: (employeeId: string) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  currentPage,
  pageSize,
  sortField,
  sortDirection,
  handleSort,
  handleEdit,
  handleDelete
}) => {
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
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Photo</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
              Nom
              {sortField === 'name' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
              Email
              {sortField === 'email' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('department')}>
              Département
              {sortField === 'department' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead className="hidden md:table-cell">Statut</TableHead>
            <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('startDate')}>
              Date d'embauche
              {sortField === 'startDate' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
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
                  {employee.department}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {getStatusBadge(employee.status)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  {employee.startDate}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Ouvrir le menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEdit(employee.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Exporter
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(employee.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
