
import React from 'react';
import { TableHead, TableRow, TableHeader } from '@/components/ui/table';
import { Employee } from '@/types/employee';

interface EmployeeTableHeadProps {
  sortField: keyof Employee;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: keyof Employee) => void;
}

const EmployeeTableHead: React.FC<EmployeeTableHeadProps> = ({
  sortField,
  sortDirection,
  handleSort,
}) => {
  return (
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
  );
};

export default EmployeeTableHead;
