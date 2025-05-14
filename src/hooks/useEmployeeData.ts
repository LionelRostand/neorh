
import { useState, useEffect, useMemo } from 'react';
import { Employee } from '@/types/employee';
import { useCollection } from '@/hooks/useCollection';
import { calculateDepartmentStats, calculateStatusStats } from '@/utils/employeeStatsUtils';
import { toast } from "@/hooks/use-toast";

export const useEmployeeData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const { getAll, isLoading: isFirestoreLoading, error: firestoreError } = useCollection<'hr_employees'>();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const firestoreEmployees = await getAll();
        
        // Transform Firestore data to match the Employee type
        const transformedEmployees = firestoreEmployees.map(emp => ({
          id: emp.id,
          name: `${emp.firstName} ${emp.lastName}`,
          position: emp.position,
          department: emp.department,
          email: emp.email,
          phone: emp.phone || '',
          photoUrl: emp.avatarUrl || '',
          managerId: emp.managerId,
          startDate: emp.hireDate,
          status: emp.status
        })) as Employee[];
        
        setEmployees(transformedEmployees);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données des employés depuis Firebase",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [getAll]);

  // Calculate statistics based on employees
  const departmentStats = useMemo(() => {
    if (!employees.length) return [];
    
    // Group employees by department and count
    const departments: Record<string, number> = {};
    employees.forEach(employee => {
      if (employee.department) {
        departments[employee.department] = (departments[employee.department] || 0) + 1;
      }
    });
    
    // Transform to array format needed for stats
    return Object.entries(departments).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const statusStats = useMemo(() => {
    if (!employees.length) return [];
    
    // Group employees by status and count
    const statuses: Record<string, number> = {
      active: 0,
      onLeave: 0,
      inactive: 0
    };
    
    employees.forEach(employee => {
      if (employee.status) {
        statuses[employee.status] = (statuses[employee.status] || 0) + 1;
      }
    });
    
    // Transform to array format needed for stats
    return Object.entries(statuses).map(([name, value]) => ({ name, value }));
  }, [employees]);

  // Combine loading state
  const combinedIsLoading = isLoading || isFirestoreLoading;
  
  // Combine error state
  const combinedError = error || firestoreError;

  return {
    employees,
    isLoading: combinedIsLoading,
    error: combinedError,
    departmentStats,
    statusStats
  };
};
