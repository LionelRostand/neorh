
import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

export interface Department {
  id: string;
  name: string;
  description?: string;
  company?: string;
}

export const useDepartmentsData = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDepartments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const departmentsCollection = collection(db, 'hr_departments');
      const departmentsSnapshot = await getDocs(departmentsCollection);
      
      const departmentsData = departmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || '',
        description: doc.data().description || '',
        company: doc.data().company || ''
      }));
      
      setDepartments(departmentsData);
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(err instanceof Error ? err : new Error(errorMessage));
      setIsLoading(false);
      
      toast({
        title: "Erreur de chargement",
        description: `Impossible de charger les données des départements: ${errorMessage}`,
        variant: "destructive"
      });
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
