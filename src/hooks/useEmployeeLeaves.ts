
import { useState, useEffect, useCallback } from 'react';
import { Leave } from '@/lib/constants';
import { useFirestore } from './useFirestore';
import { toast } from '@/components/ui/use-toast';

export const useEmployeeLeaves = (employeeId: string) => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalDays, setTotalDays] = useState(0);
  const { search } = useFirestore<Leave>('hr_leaves');

  // Utiliser useCallback pour mémoriser la fonction fetchEmployeeLeaves
  const fetchEmployeeLeaves = useCallback(async () => {
    if (!employeeId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log("Fetching leaves for employee:", employeeId);
      const result = await search('employeeId', employeeId, {
        sortField: 'startDate',
        sortDirection: 'desc'
      });
      
      console.log("Leaves result:", result);
      
      if (result.docs) {
        setLeaves(result.docs);
        
        // Calculate total leave days
        const total = result.docs.reduce((acc, leave) => {
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
        description: "Impossible de charger les congés de l'employé",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [employeeId, search]);

  useEffect(() => {
    fetchEmployeeLeaves();
  }, [fetchEmployeeLeaves]); // Dépend uniquement de fetchEmployeeLeaves qui dépend d'employeeId

  // Ajouter une fonction pour traduire les types de congés
  const getLeaveTypeLabel = (type: string): string => {
    switch (type) {
      case 'paid': return 'Congé payé';
      case 'rtt': return 'RTT';
      case 'sick': return 'Congé Maladie';
      case 'family': return 'Congé Familial';
      case 'maternity': return 'Congé Maternité';
      case 'paternity': return 'Congé Paternité';
      case 'annual': return 'Congé annuel';
      default: return type;
    }
  };

  return {
    leaves,
    loading,
    error,
    totalDays,
    getLeaveTypeLabel,
    refetch: fetchEmployeeLeaves // Ajout d'une méthode pour rafraîchir manuellement
  };
};
