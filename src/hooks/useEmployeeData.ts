
import { useState, useEffect, useCallback } from 'react';
import { Employee } from '@/types/employee';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';
import { useDepartmentsData } from '@/hooks/useDepartmentsData';

export const useEmployeeData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departmentStats, setDepartmentStats] = useState<Record<string, number>>({});
  const [statusStats, setStatusStats] = useState<Record<string, number>>({});
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // Get departments data to map department IDs to names
  const { departments } = useDepartmentsData();

  const fetchEmployees = useCallback(async () => {
    // Si les données sont déjà chargées, ne pas recharger
    if (hasLoaded && employees.length > 0) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching employees from Firestore');
      const employeesCollection = collection(db, 'hr_employees');
      const employeesSnapshot = await getDocs(employeesCollection);
      
      // Create a set to track unique employee IDs to prevent duplicates
      const processedEmployeeIds = new Set<string>();
      const employeesData: Employee[] = [];
      
      // Traitements parallèles avec Promise.all pour les données des départements
      const employeePromises = employeesSnapshot.docs.map(async (doc) => {
        // Skip if we've already processed this ID
        if (processedEmployeeIds.has(doc.id)) return null;
        
        processedEmployeeIds.add(doc.id);
        const data = doc.data();
        
        // Find department name based on department ID
        let departmentName = data.department || '';
        if (departments?.length && data.department) {
          const dept = departments.find(d => d.id === data.department);
          if (dept) {
            departmentName = dept.name;
          } else if (data.department) {
            // Si on n'a pas trouvé le département dans la liste, essayons de le récupérer directement
            try {
              const deptDoc = await getDoc(doc(db, 'hr_departments', data.department));
              if (deptDoc.exists()) {
                departmentName = deptDoc.data().name || data.department;
              }
            } catch (err) {
              console.error("Erreur lors de la récupération du département:", err);
            }
          }
        }
        
        return {
          id: doc.id,
          name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          position: data.position || '',
          department: departmentName,
          departmentId: data.department || '', // Keep the original ID for reference
          email: data.email || '',
          phone: data.phone || '',
          photoUrl: data.photoUrl || '',
          startDate: data.hireDate || '',
          status: data.status || 'inactive',
          professionalEmail: data.professionalEmail || '',
          birthDate: data.birthDate || '',
          personalEmail: data.email || ''
        } as Employee;
      });
      
      const resolvedEmployees = await Promise.all(employeePromises);
      const validEmployees = resolvedEmployees.filter((emp): emp is Employee => emp !== null);
      
      setEmployees(validEmployees);
      setHasLoaded(true);

      // Calculate department statistics
      const deptStats: Record<string, number> = {};
      validEmployees.forEach(emp => {
        if (emp.department) {
          deptStats[emp.department] = (deptStats[emp.department] || 0) + 1;
        }
      });
      setDepartmentStats(deptStats);

      // Calculate status statistics
      const statStats: Record<string, number> = {};
      validEmployees.forEach(emp => {
        if (emp.status) {
          statStats[emp.status] = (statStats[emp.status] || 0) + 1;
        }
      });
      setStatusStats(statStats);
      
      console.log("Fetched employees:", validEmployees.length);
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
  }, [departments, employees.length, hasLoaded]);

  // Charger les données une seule fois au montage du composant
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
