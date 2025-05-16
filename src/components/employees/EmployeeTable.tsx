
import React from 'react';
import { 
  Table, 
  TableBody
} from '@/components/ui/table';
import { Employee } from '@/types/employee';
import EmployeeTableHead from './table/EmployeeTableHead';
import EmployeeTableRow from './table/EmployeeTableRow';

interface EmployeeTableProps {
  employees: Employee[];
  currentPage: number;
  pageSize: number;
  sortField: keyof Employee;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: keyof Employee) => void;
  handleEdit: (employeeId: string) => void;
  handleDelete: (employeeId: string) => void;
  handleView: (employeeId: string) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  currentPage,
  pageSize,
  sortField,
  sortDirection,
  handleSort,
  handleEdit,
  handleDelete,
  handleView
}) => {
  // Use a Set to track employees already displayed and avoid duplicates
  const renderedEmployees = new Set<string>();

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <EmployeeTableHead
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
        />
        <TableBody>
          {employees.map((employee) => {
            // Skip duplicates
            if (renderedEmployees.has(employee.id)) {
              return null;
            }
            
            // Add the ID to the list of employees already displayed
            renderedEmployees.add(employee.id);
            
            return (
              <EmployeeTableRow
                key={employee.id}
                employee={employee}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleView={handleView}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
