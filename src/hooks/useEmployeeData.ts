
import { useState, useEffect, useMemo } from 'react';
import { Employee } from '@/types/employee';
import { useCollection } from '@/hooks/useCollection';
import { transformEmployeesData } from '@/utils/employeeTransformUtils';

export const useEmployeeData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [rawEmployees, setRawEmployees] = useState<any[]>([]);
  
  // Utiliser le hook useCollection avec une collection spécifique
  // pour éviter les changements de collection en boucle
  const { getAll, isLoading: isFirestoreLoading, error: firestoreError } = useCollection<'hr_employees'>('hr_employees');

  useEffect(() => {
    let isMounted = true;
    
    const loadEmployeesFromFirestore = async () => {
      try {
        setIsLoading(true);
        const firestoreEmployees = await getAll();
        
        if (isMounted) {
          setRawEmployees(firestoreEmployees);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des employés depuis Firestore:", err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
          setIsLoading(false);
        }
      }
    };

    loadEmployeesFromFirestore();
    
    // Nettoyage pour éviter les mises à jour sur un composant démonté
    return () => {
      isMounted = false;
    };
  }, [getAll]);

  // Transform firestore data to match the Employee type
  const employees = useMemo(() => 
    transformEmployeesData(rawEmployees), 
    [rawEmployees]
  );

  // Calculate statistics
  const departmentStats = useMemo(() => {
    const stats: Record<string, number> = {};
    employees.forEach(emp => {
      if (emp.department) {
        stats[emp.department] = (stats[emp.department] || 0) + 1;
      }
    });
    return stats;
  }, [employees]);

  const statusStats = useMemo(() => {
    const stats: Record<string, number> = {
      active: 0,
      onLeave: 0,
      inactive: 0
    };
    employees.forEach(emp => {
      if (emp.status) {
        stats[emp.status] = (stats[emp.status] || 0) + 1;
      }
    });
    return stats;
  }, [employees]);

  return {
    employees,
    isLoading: isLoading || isFirestoreLoading,
    error: error || firestoreError,
    departmentStats,
    statusStats
  };
};
