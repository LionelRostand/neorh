
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useEmployeeFilters } from '@/hooks/useEmployeeFilters';
import { Employee } from '@/types/employee';
import EmployeeSearch from './EmployeeSearch';
import EmployeeTable from './EmployeeTable';
import EmployeeEmptyState from './EmployeeEmptyState';
import EmployeePagination from './EmployeePagination';
import EmployeeTableSkeleton from './EmployeeTableSkeleton';
import EditEmployeeDialog from './EditEmployeeDialog';
import DeleteEmployeeConfirmDialog from './DeleteEmployeeConfirmDialog';
import ViewEmployeeDialog from './view-dialog/ViewEmployeeDialog';

interface EmployeesProfilesProps {
  employees: Employee[] | undefined;
  isLoading: boolean;
  onRefresh?: () => void;
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ 
  employees = [], 
  isLoading,
  onRefresh 
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

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

  const handleEdit = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setIsEditDialogOpen(true);
    } else {
      toast({
        title: "Erreur",
        description: "Employé non trouvé",
        variant: "destructive"
      });
    }
  };

  const handleDelete = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setIsDeleteDialogOpen(true);
    } else {
      toast({
        title: "Erreur",
        description: "Employé non trouvé",
        variant: "destructive"
      });
    }
  };
  
  const handleView = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setViewDialogOpen(true);
    } else {
      toast({
        title: "Erreur",
        description: "Employé non trouvé",
        variant: "destructive"
      });
    }
  };

  const handleSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleViewClose = () => {
    if (viewDialogOpen) {
      onRefresh?.();
    }
    setViewDialogOpen(false);
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
            handleView={handleView}
          />
          
          <EmployeePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Dialogs for Edit, Delete and View */}
      <EditEmployeeDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        employee={selectedEmployee}
        onSuccess={handleSuccess}
      />

      <DeleteEmployeeConfirmDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        employee={selectedEmployee}
        onSuccess={handleSuccess}
      />
      
      <ViewEmployeeDialog
        open={viewDialogOpen}
        onOpenChange={handleViewClose}
        employee={selectedEmployee}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default EmployeesProfiles;
