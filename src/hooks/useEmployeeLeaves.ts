
import { useState, useEffect } from 'react';
import { Leave } from '@/lib/constants';
import { useFirestore } from './useFirestore';
import { toast } from '@/components/ui/use-toast';

export const useEmployeeLeaves = (employeeId: string) => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalDays, setTotalDays] = useState(0);
  const { search } = useFirestore<Leave>('hr_leaves');

  useEffect(() => {
    if (!employeeId) return;
    
    const fetchEmployeeLeaves = async () => {
      setLoading(true);
      try {
        const result = await search([
          { field: 'employeeId', operator: '==', value: employeeId }
        ]);
        
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
    };

    fetchEmployeeLeaves();
  }, [employeeId, search]);

  return {
    leaves,
    loading,
    error,
    totalDays
  };
};
