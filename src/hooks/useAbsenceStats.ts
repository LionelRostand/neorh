
import { useState, useEffect } from 'react';
import { useFirestore } from './firestore';
import { toast } from '@/components/ui/use-toast';

export const useAbsenceStats = () => {
  const [absenceData, setAbsenceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { getAll } = useFirestore('hr_leaves');
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await getAll();
        
        if (result.docs && result.docs.length > 0) {
          // Process data for absence chart
          const processedData = processAbsenceData(result.docs);
          setAbsenceData(processedData);
        } else {
          // Use sample data if no results
          setAbsenceData([
            { name: 'Maladie', value: 12 },
            { name: 'Congés payés', value: 25 },
            { name: 'Formation', value: 5 },
            { name: 'Personnel', value: 8 },
            { name: 'Autre', value: 3 },
          ]);
        }
      } catch (err) {
        console.error("Error fetching absence stats:", err);
        setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les statistiques d'absences",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return { absenceData, isLoading, error };
};

// Helper function to process absence data
const processAbsenceData = (leaves: any[]) => {
  const absenceTypeCount: Record<string, number> = {};
  
  leaves.forEach(leave => {
    const type = leave.type || 'Non spécifié';
    absenceTypeCount[type] = (absenceTypeCount[type] || 0) + 1;
  });
  
  return Object.entries(absenceTypeCount).map(([name, value]) => ({
    name,
    value
  }));
};
