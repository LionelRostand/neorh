
import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

// Using the firebase type definition for Employee
import { Employee } from '@/types/firebase';

// Extended type for managers with name property
interface ManagerData extends Employee {
  name: string;
}

export const useManagersData = () => {
  const [managers, setManagers] = useState<ManagerData[]>([]);
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
        const managersData = employeesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            department: data.department || '',
            position: data.position || '',
            status: data.status || 'active',
            hireDate: data.hireDate || '',
            avatarUrl: data.avatarUrl || '',
            managerId: data.managerId || '',
            // Add the name property by combining firstName and lastName
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim()
          };
        });
        
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
