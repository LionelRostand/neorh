
import { useState, useMemo } from 'react';
import { Employee } from '@/types/employee';

export const useEmployeeFilters = (employees: Employee[] | undefined = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Employee>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const PAGE_SIZE = 10;
  
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

  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedEmployees.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredAndSortedEmployees, currentPage]);

  const totalPages = useMemo(() => 
    Math.ceil((filteredAndSortedEmployees?.length || 0) / PAGE_SIZE),
    [filteredAndSortedEmployees]
  );

  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
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
  };
};
