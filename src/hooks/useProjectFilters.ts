
import { useState, useMemo } from 'react';
import { Project } from '@/types/project';

export const useProjectFilters = (projects: Project[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Project | ''>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const PAGE_SIZE = 10;

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...(projects || [])];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.client.toLowerCase().includes(term)
      );
    }
    
    // Sort by field
    if (sortField) {
      filtered.sort((a, b) => {
        const fieldA = a[sortField];
        const fieldB = b[sortField];
        
        if (fieldA === undefined || fieldB === undefined) return 0;
        
        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
          return sortDirection === 'asc'
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        }
        
        // Fallback for other types
        if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [projects, searchTerm, sortField, sortDirection]);
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProjects.length / PAGE_SIZE));
  
  // Ensure currentPage is within bounds
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
  
  // Get paginated data
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredAndSortedProjects.slice(start, end);
  }, [filteredAndSortedProjects, currentPage, PAGE_SIZE]);
  
  // Handle sorting
  const handleSort = (field: keyof Project) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    sortField,
    sortDirection,
    paginatedProjects,
    filteredAndSortedProjects,
    totalPages,
    PAGE_SIZE,
    handleSort,
    handlePageChange
  };
};
