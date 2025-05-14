
import { useState, useEffect, useMemo } from 'react';
import { Employee } from '@/types/employee';
import { MockEmployee } from '@/data/mockEmployees';
import { fetchEmployees } from '@/services/employeeService';
import { transformEmployeesData } from '@/utils/employeeTransformUtils';
import { calculateDepartmentStats, calculateStatusStats } from '@/utils/employeeStatsUtils';

export const useEmployeeData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [rawEmployees, setRawEmployees] = useState<MockEmployee[]>([]);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees();
        setRawEmployees(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
        setIsLoading(false);
      }
    };

    loadEmployees();
  }, []);

  // Transform mock data to match the Employee type
  const employees = useMemo(() => 
    transformEmployeesData(rawEmployees), 
    [rawEmployees]
  );

  // Calculate statistics
  const departmentStats = useMemo(() => 
    calculateDepartmentStats(rawEmployees),
    [rawEmployees]
  );

  const statusStats = useMemo(() => 
    calculateStatusStats(rawEmployees),
    [rawEmployees]
  );

  return {
    employees,
    isLoading,
    error,
    departmentStats,
    statusStats
  };
};
