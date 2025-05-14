
import { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

export const useEmployeeData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departmentStats, setDepartmentStats] = useState<Record<string, number>>({});
  const [statusStats, setStatusStats] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesCollection = collection(db, 'hr_employees');
        const employeesSnapshot = await getDocs(employeesCollection);
        
        const employeesData = employeesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
            position: data.position || '',
            department: data.department || '',
            email: data.email || '',
            phone: data.phone || '',
            photoUrl: data.photoUrl || '',
            startDate: data.hireDate || '',
            status: data.status || 'inactive'
          } as Employee;
        });
        
        setEmployees(employeesData);

        // Calculate department statistics
        const deptStats: Record<string, number> = {};
        employeesData.forEach(emp => {
          if (emp.department) {
            deptStats[emp.department] = (deptStats[emp.department] || 0) + 1;
          }
        });
        setDepartmentStats(deptStats);

        // Calculate status statistics
        const statStats: Record<string, number> = {};
        employeesData.forEach(emp => {
          if (emp.status) {
            statStats[emp.status] = (statStats[emp.status] || 0) + 1;
          }
        });
        setStatusStats(statStats);
        
        setIsLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
        setError(err instanceof Error ? err : new Error(errorMessage));
        setIsLoading(false);
        
        toast({
          title: "Erreur de chargement",
          description: `Impossible de charger les données des employés: ${errorMessage}`,
          variant: "destructive"
        });
      }
    };

    fetchEmployees();
  }, []);

  return {
    employees,
    isLoading,
    error,
    departmentStats,
    statusStats
  };
};
