
import { useState, useEffect, useCallback } from 'react';
import { Employee } from '@/types/employee';
import { collection, getDocs, doc, getDoc, DocumentData } from 'firebase/firestore';
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

  // Create a memoized cache for departments to avoid redundant fetches
  const [departmentCache, setDepartmentCache] = useState<Record<string, string>>({});

  const fetchEmployees = useCallback(async () => {
    // If data is already loaded, don't reload unless explicitly requested
    if (hasLoaded && employees.length > 0) {
      console.log('Using cached employee data, skipping fetch');
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
      
      // Prepare department cache from already loaded departments
      const deptCache: Record<string, string> = { ...departmentCache };
      if (departments?.length) {
        departments.forEach(dept => {
          if (dept.id && dept.name) {
            deptCache[dept.id] = dept.name;
          }
        });
      }
      
      // Process all employees in one batch
      const employeesData: Employee[] = [];
      
      for (const docSnapshot of employeesSnapshot.docs) {
        // Skip if we've already processed this ID
        if (processedEmployeeIds.has(docSnapshot.id)) continue;
        
        processedEmployeeIds.add(docSnapshot.id);
        const data = docSnapshot.data();
        
        // Find department name based on department ID
        let departmentName = data.department || '';
        if (data.department) {
          // First check our cache
          if (deptCache[data.department]) {
            departmentName = deptCache[data.department];
          } 
          // If not in cache but departments are loaded, look there
          else if (departments?.length) {
            const dept = departments.find(d => d.id === data.department);
            if (dept) {
              departmentName = dept.name;
              // Update cache
              deptCache[data.department] = dept.name;
            } 
            // Last resort: fetch individually (should be rare)
            else {
              try {
                const deptDocRef = doc(db, 'hr_departments', data.department);
                const deptDocSnap = await getDoc(deptDocRef);
                if (deptDocSnap.exists()) {
                  const deptData = deptDocSnap.data();
                  departmentName = deptData.name || data.department;
                  // Update cache
                  deptCache[data.department] = departmentName;
                }
              } catch (err) {
                console.error("Error fetching department:", err);
              }
            }
          }
        }
        
        employeesData.push({
          id: docSnapshot.id,
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
        } as Employee);
      }
      
      // Update the department cache for future use
      setDepartmentCache(deptCache);
      
      // Update employee data
      setEmployees(employeesData);
      setHasLoaded(true);

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
  }, [departments, employees.length, hasLoaded, departmentCache]);

  // Load data only once when component mounts
  useEffect(() => {
    if (!hasLoaded) {
      fetchEmployees();
    }
  }, [fetchEmployees, hasLoaded]);

  return {
    employees,
    isLoading,
    error,
    departmentStats,
    statusStats,
    refetch: fetchEmployees
  };
};
