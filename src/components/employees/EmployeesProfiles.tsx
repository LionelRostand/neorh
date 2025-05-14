
import React, { useState, useMemo } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { Employee } from '@/types/employee';
import EmployeeTable from './EmployeeTable';
import EmployeeTableSkeleton from './EmployeeTableSkeleton';
import EmptyEmployeeState from './EmptyEmployeeState';
import EmployeeSearch from './EmployeeSearch';
import EmployeePagination from './EmployeePagination';

interface EmployeesProfilesProps {
  employees: Employee[] | undefined;
  isLoading: boolean;
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ employees = [], isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Employee>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { deleteEmployee } = useEmployeeActions();
  
  const PAGE_SIZE = 10;
  
  // Filter and sort employees
  const filteredAndSortedEmployees = useMemo(() => {
    if (!employees || employees.length === 0) return [];
    
    return employees
      .filter(employee => {
        if (!searchTerm) return true;
        
        const search = searchTerm.toLowerCase();
        return (
          (employee.name && employee.name.toLowerCase().includes(search)) ||
          (employee.email && employee.email.toLowerCase().includes(search)) ||
          (employee.department && employee.department.toLowerCase().includes(search)) ||
          (employee.position && employee.position.toLowerCase().includes(search))
        );
      })
      .sort((a, b) => {
        const valueA = a[sortField] || '';
        const valueB = b[sortField] || '';
        
        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [employees, searchTerm, sortField, sortDirection]);

  // Calculate total pages
  const totalPages = useMemo(() => 
    Math.ceil((filteredAndSortedEmployees?.length || 0) / PAGE_SIZE),
    [filteredAndSortedEmployees]
  );

  // Sort handler
  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Delete handler
  const handleDelete = (employeeId: string) => {
    deleteEmployee(employeeId);
    toast({
      title: "Employé supprimé",
      description: "Le profil de l'employé a été supprimé avec succès."
    });
  };

  // Edit handler
  const handleEdit = (employeeId: string) => {
    // Implementation for editing would be added here
    toast({
      title: "Modification",
      description: `Édition de l'employé avec ID: ${employeeId}`
    });
  };

  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Search change handler
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

  if (isLoading) {
    return <EmployeeTableSkeleton />;
  }

  return (
    <div className="p-4">
      <EmployeeSearch 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {filteredAndSortedEmployees.length === 0 ? (
        <EmptyEmployeeState />
      ) : (
        <>
          <EmployeeTable 
            employees={filteredAndSortedEmployees}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          
          <EmployeePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default EmployeesProfiles;
