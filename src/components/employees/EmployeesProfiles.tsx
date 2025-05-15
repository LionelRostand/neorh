
import React from 'react';
import { toast } from '@/components/ui/use-toast';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { useEmployeeFilters } from '@/hooks/useEmployeeFilters';
import { Employee } from '@/types/employee';
import EmployeeSearch from './EmployeeSearch';
import EmployeeTable from './EmployeeTable';
import EmployeeEmptyState from './EmployeeEmptyState';
import EmployeePagination from './EmployeePagination';
import EmployeeTableSkeleton from './EmployeeTableSkeleton';

interface EmployeesProfilesProps {
  employees: Employee[] | undefined;
  isLoading: boolean;
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ employees = [], isLoading }) => {
  const { deleteEmployee } = useEmployeeActions();
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    sortField,
    sortDirection,
    paginatedEmployees,
    filteredAndSortedEmployees,
    totalPages,
    PAGE_SIZE,
    handleSort,
    handlePageChange
  } = useEmployeeFilters(employees);

  const handleDelete = (employeeId: string) => {
    deleteEmployee(employeeId);
    toast({
      title: "Employé supprimé",
      description: "Le profil de l'employé a été supprimé avec succès."
    });
  };

  const handleEdit = (employeeId: string) => {
    // Implementation for editing would be added here
    toast({
      title: "Modification",
      description: `Édition de l'employé avec ID: ${employeeId}`
    });
  };

  if (isLoading) {
    return <EmployeeTableSkeleton />;
  }

  return (
    <div className="p-4">
      <EmployeeSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {filteredAndSortedEmployees.length === 0 ? (
        <EmployeeEmptyState />
      ) : (
        <>
          <EmployeeTable 
            employees={paginatedEmployees}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
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
