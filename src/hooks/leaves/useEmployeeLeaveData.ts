
import { useState, useCallback, useEffect } from 'react';
import { Leave } from '@/lib/constants';
import { useFirestore } from '../firestore';
import { toast } from '@/components/ui/use-toast';

export const useEmployeeLeaveData = (employeeId: string) => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalDays, setTotalDays] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  const { search } = useFirestore<Leave>('hr_leaves');

  const fetchEmployeeLeaves = useCallback(async () => {
    // Skip fetch if no employeeId or already loaded
    if (!employeeId) {
      setLoading(false);
      return;
    }
    
    if (hasLoaded && leaves.length > 0) {
      console.log(`Using cached leave data for employee ${employeeId}`);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log("Fetching leaves for employee:", employeeId);
      
      // Perform search by employeeId
      const result = await search('employeeId', employeeId);
      
      if (result.docs) {
        // Sort results by start date in descending order
        const sortedLeaves = [...result.docs].sort((a, b) => {
          if (!a.startDate || !b.startDate) return 0;
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        });
        
        setLeaves(sortedLeaves);
        setHasLoaded(true);
        
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
  
  // Initial fetch when component mounts or employeeId changes
  useEffect(() => {
    if (employeeId && !hasLoaded) {
      fetchEmployeeLeaves();
    }
  }, [employeeId, fetchEmployeeLeaves, hasLoaded]);

  return {
    leaves,
    loading,
    error,
    totalDays,
    fetchLeaves: fetchEmployeeLeaves
  };
};
