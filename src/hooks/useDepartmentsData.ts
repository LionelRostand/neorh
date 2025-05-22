
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

  const fetchDepartments = useCallback(async () => {
    console.log('Starting to fetch departments');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching departments from Firestore...');
      const departmentsCollection = collection(db, 'hr_departments');
      const departmentsSnapshot = await getDocs(departmentsCollection);
      
      // Check if component is still mounted
      if (!isMounted.current) {
        console.log('Component unmounted, skipping state update');
        return;
      }
      
      if (departmentsSnapshot.empty) {
        console.log('No departments found in Firestore');
        setDepartments([]);
        
        toast({
          title: "Information",
          description: "Aucun département trouvé dans la base de données.",
          variant: "default"
        });
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
        console.log('Finished fetching departments');
      }
    }
  }, []);
  
  // Manual refetch that bypasses the hasRun check
  const refetch = useCallback(async () => {
    console.log('Manually refetching departments');
    await fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    console.log('Department data hook initialized');
    fetchDepartments();
    
    return () => {
      console.log('Department data hook cleanup');
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
