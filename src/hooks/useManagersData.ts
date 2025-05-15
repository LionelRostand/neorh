
import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';
import { Employee } from '@/types/employee';

export const useManagersData = () => {
  const [managers, setManagers] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchManagers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Récupérer tous les employés actifs qui peuvent être des responsables
      const managersQuery = query(
        collection(db, 'hr_employees'),
        where('status', '==', 'active')
      );
      const managersSnapshot = await getDocs(managersQuery);
      
      const managersData = managersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          position: data.position || '',
          department: data.department || '',
          email: data.email || '',
          status: data.status || 'inactive'
        } as Employee;
      });
      
      setManagers(managersData);
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(err instanceof Error ? err : new Error(errorMessage));
      setIsLoading(false);
      
      toast({
        title: "Erreur de chargement",
        description: `Impossible de charger les données des responsables: ${errorMessage}`,
        variant: "destructive"
      });
    }
  }, []);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  return {
    managers,
    isLoading,
    error,
    refetch: fetchManagers
  };
};
