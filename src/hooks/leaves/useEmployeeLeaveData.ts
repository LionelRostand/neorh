
import { useState, useCallback } from 'react';
import { Leave } from '@/lib/constants';
import { useFirestore } from '../firestore';
import { toast } from '@/components/ui/use-toast';

export const useEmployeeLeaveData = (employeeId: string) => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalDays, setTotalDays] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false); // Pour éviter les chargements répétés
  
  const { search } = useFirestore<Leave>('hr_leaves');

  const fetchEmployeeLeaves = useCallback(async () => {
    // Si nous avons déjà chargé les données et que l'ID est inchangé, ne pas recharger
    if (!employeeId || (hasLoaded && leaves.length > 0)) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log("Fetching leaves for employee:", employeeId);
      
      // Effectuer la recherche par employeeId sans options de tri
      const result = await search('employeeId', employeeId);
      
      if (result.docs) {
        // Tri manuel des résultats par date de début décroissante
        const sortedLeaves = [...result.docs].sort((a, b) => {
          if (!a.startDate || !b.startDate) return 0;
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        });
        
        setLeaves(sortedLeaves);
        setHasLoaded(true); // Marquer comme chargé
        
        // Calculate total leave days
        const total = sortedLeaves.reduce((acc, leave) => {
          if (leave.startDate && leave.endDate && leave.status === 'approved') {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start day
            return acc + diffDays;
          }
          return acc;
        }, 0);
        
        setTotalDays(total);
      }
    } catch (err) {
      console.error("Error fetching employee leaves:", err);
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      toast({
        title: "Erreur",
        description: "Impossible de charger les congés de l'employé.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [employeeId, search, leaves.length, hasLoaded]);

  return {
    leaves,
    loading,
    error,
    totalDays,
    fetchLeaves: fetchEmployeeLeaves
  };
};
