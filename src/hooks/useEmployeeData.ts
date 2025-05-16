
import { useState, useEffect, useCallback } from 'react';
import { Employee } from '@/types/employee';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';
import { useDepartmentsData } from '@/hooks/useDepartmentsData';

export const useEmployeeData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departmentStats, setDepartmentStats] = useState<Record<string, number>>({});
  const [statusStats, setStatusStats] = useState<Record<string, number>>({});
  
  // Get departments data to map department IDs to names
  const { departments } = useDepartmentsData();

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const employeesCollection = collection(db, 'hr_employees');
      const employeesSnapshot = await getDocs(employeesCollection);
      
      // Create a set to track unique employee IDs to prevent duplicates
      const processedEmployeeIds = new Set<string>();
      const employeesData: Employee[] = [];
      
      employeesSnapshot.docs.forEach(doc => {
        // Skip if we've already processed this ID
        if (processedEmployeeIds.has(doc.id)) return;
        
        processedEmployeeIds.add(doc.id);
        const data = doc.data();
        
        // Find department name based on department ID
        let departmentName = data.department || '';
        if (departments?.length && data.department) {
          const dept = departments.find(d => d.id === data.department);
          if (dept) {
            departmentName = dept.name;
          }
        }
        
        employeesData.push({
          id: doc.id,
          name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          position: data.position || '',
          department: departmentName,
          departmentId: data.department || '', // Keep the original ID for reference
          email: data.email || '',
          phone: data.phone || '',
          photoUrl: data.photoUrl || '',
          startDate: data.hireDate || '',
          status: data.status || 'inactive'
        } as Employee);
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
      
      console.log("Fetched employees:", employeesData.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      toast({
        title: "Erreur de chargement",
        description: `Impossible de charger les données des employés: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [departments]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    isLoading,
    error,
    departmentStats,
    statusStats,
    refetch: fetchEmployees
  };
};
