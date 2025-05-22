
import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';
import { Department } from '@/types/firebase';
import { DEPARTMENT_COLORS } from '@/components/departments/tabs/schema/departmentSchema';

export const useDepartmentsData = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);
  const hasRun = useRef(false);

  const fetchDepartments = useCallback(async () => {
    // Nous allons toujours exécuter la requête pour s'assurer que les données sont chargées
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching departments from Firestore');
      const departmentsCollection = collection(db, 'hr_departments');
      const departmentsSnapshot = await getDocs(departmentsCollection);
      
      // Check if component is still mounted
      if (!isMounted.current) return;
      
      if (departmentsSnapshot.empty) {
        console.log('No departments found in Firestore');
        setDepartments([]);
      } else {
        const departmentsData = departmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || '',
          description: doc.data().description || '',
          managerId: doc.data().managerId || '',
          companyId: doc.data().companyId || '',
          budget: doc.data().budget || 0,
          objectives: doc.data().objectives || '',
          color: doc.data().color || DEPARTMENT_COLORS[0],
          parentDepartmentId: doc.data().parentDepartmentId || ''
        }));
        
        console.log(`Retrieved ${departmentsData.length} departments`);
        setDepartments(departmentsData);
      }
      
      // Mark that we've run the fetch
      hasRun.current = true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      console.error('Error fetching departments:', errorMessage);
      
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error(errorMessage));
        
        toast({
          title: "Erreur de chargement",
          description: `Impossible de charger les données des départements: ${errorMessage}`,
          variant: "destructive"
        });
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);
  
  // Manual refetch that bypasses the hasRun check
  const refetch = useCallback(async () => {
    await fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    fetchDepartments();
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchDepartments]);

  return {
    departments,
    isLoading,
    error,
    refetch
  };
};
