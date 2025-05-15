
import { useState, useEffect } from 'react';
import { useFirestore } from './firestore';
import { toast } from '@/components/ui/use-toast';

export const useRecruitmentStats = () => {
  const [recruitmentData, setRecruitmentData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { getAll } = useFirestore('hr_recruitment');
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await getAll();
        
        if (result.docs && result.docs.length > 0) {
          // Process data for recruitment chart
          const processedData = processRecruitmentData(result.docs);
          setRecruitmentData(processedData);
        } else {
          // Use sample data if no results
          setRecruitmentData([
            { name: 'Jan', candidats: 10, embauches: 2 },
            { name: 'Fév', candidats: 15, embauches: 3 },
            { name: 'Mar', candidats: 18, embauches: 4 },
            { name: 'Avr', candidats: 12, embauches: 2 },
            { name: 'Mai', candidats: 20, embauches: 5 },
            { name: 'Jun', candidats: 25, embauches: 6 },
          ]);
        }
      } catch (err) {
        console.error("Error fetching recruitment stats:", err);
        setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les statistiques de recrutement",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return { recruitmentData, isLoading, error };
};

// Helper function to process recruitment data
const processRecruitmentData = (recruitments: any[]) => {
  // Group by month
  const monthlyStats: Record<string, { candidats: number, embauches: number }> = {
    'Jan': { candidats: 0, embauches: 0 },
    'Fév': { candidats: 0, embauches: 0 },
    'Mar': { candidats: 0, embauches: 0 },
    'Avr': { candidats: 0, embauches: 0 },
    'Mai': { candidats: 0, embauches: 0 },
    'Jun': { candidats: 0, embauches: 0 },
  };
  
  // Get current year
  const currentYear = new Date().getFullYear();
  
  recruitments.forEach(recruitment => {
    const createdAt = recruitment.createdAt ? new Date(recruitment.createdAt) : null;
    
    if (createdAt && createdAt.getFullYear() === currentYear) {
      const monthIndex = createdAt.getMonth();
      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      const monthName = monthNames[monthIndex];
      
      if (monthName in monthlyStats) {
        monthlyStats[monthName].candidats++;
        
        // If the status is "hired", count as an embauche
        if (recruitment.status === 'hired') {
          monthlyStats[monthName].embauches++;
        }
      }
    }
  });
  
  return Object.entries(monthlyStats).map(([name, stats]) => ({
    name,
    candidats: stats.candidats,
    embauches: stats.embauches
  }));
};
