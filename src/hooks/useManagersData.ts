
import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

// Using the firebase type definition for Employee
import { Employee } from '@/types/firebase';

export const useManagersData = () => {
  const [managers, setManagers] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchManagers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching managers from Firestore');
      const employeesCollection = collection(db, 'hr_employees');
      // Nous récupérons tous les employés pour l'instant, mais dans une version 
      // future nous pourrions filtrer pour ne récupérer que les managers
      const employeesSnapshot = await getDocs(employeesCollection);
      
      if (employeesSnapshot.empty) {
        console.log('No managers found in Firestore');
        setManagers([]);
      } else {
        const managersData = employeesSnapshot.docs.map(doc => ({
          id: doc.id,
          firstName: doc.data().firstName || '',
          lastName: doc.data().lastName || '',
          email: doc.data().email || '',
          phone: doc.data().phone || '',
          department: doc.data().department || '',
          position: doc.data().position || '',
          status: doc.data().status || 'active',
          hireDate: doc.data().hireDate || '',
          avatarUrl: doc.data().avatarUrl || '',
          managerId: doc.data().managerId || ''
        }));
        
        console.log(`Retrieved ${managersData.length} managers`, managersData);
        setManagers(managersData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      console.error('Error fetching managers:', errorMessage);
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      toast({
        title: "Erreur de chargement",
        description: `Impossible de charger les données des managers: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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

export default useManagersData;
