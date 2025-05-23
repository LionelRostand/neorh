
import { useState, useEffect } from 'react';
import { useFirestore } from './firestore';
import { toast } from '@/components/ui/use-toast';
import { HR } from '@/lib/constants/collections';

export const useDepartmentStats = () => {
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { getAll } = useFirestore(HR.DEPARTMENTS);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await getAll();
        
        if (result.docs && result.docs.length > 0) {
          // Process data for department chart
          const processedData = processDepartmentData(result.docs);
          setDepartmentData(processedData);
        } else {
          // Use sample data if no results
          setDepartmentData([
            { name: 'RH', value: 15 },
            { name: 'IT', value: 25 },
            { name: 'Marketing', value: 18 },
            { name: 'Finance', value: 22 },
            { name: 'R&D', value: 20 },
          ]);
        }
      } catch (err) {
        console.error("Error fetching department stats:", err);
        setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les statistiques des départements",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return { departmentData, isLoading, error };
};

// Helper function to process department data
const processDepartmentData = (departments: any[]) => {
  return departments.map(dept => ({
    name: dept.name || 'Département sans nom',
    value: dept.employeesCount || 0
  }));
};
