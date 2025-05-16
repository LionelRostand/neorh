
import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';
import { Department } from '@/types/firebase';

export const useDepartmentsData = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDepartments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching departments from Firestore');
      const departmentsCollection = collection(db, 'hr_departments');
      const departmentsSnapshot = await getDocs(departmentsCollection);
      
      if (departmentsSnapshot.empty) {
        console.log('No departments found in Firestore');
        setDepartments([]);
      } else {
        const departmentsData = departmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || '',
          description: doc.data().description || '',
          managerId: doc.data().managerId || '',
          budget: doc.data().budget || 0,
          objectives: doc.data().objectives || ''
        }));
        
        console.log(`Retrieved ${departmentsData.length} departments`, departmentsData);
        setDepartments(departmentsData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      console.error('Error fetching departments:', errorMessage);
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      toast({
        title: "Erreur de chargement",
        description: `Impossible de charger les données des départements: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return {
    departments,
    isLoading,
    error,
    refetch: fetchDepartments
  };
};
