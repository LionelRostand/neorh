
import { useState, useCallback, useEffect, useRef } from 'react';
import { Leave } from '@/lib/constants';
import { useFirestore } from '../firestore';
import { toast } from '@/components/ui/use-toast';

export const useEmployeeLeaveData = (employeeId: string) => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalDays, setTotalDays] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const requestInProgressRef = useRef(false);
  
  const { search } = useFirestore<Leave>('hr_leaves');

  const fetchEmployeeLeaves = useCallback(async () => {
    // Skip fetch if no employeeId or request already in progress
    if (!employeeId || requestInProgressRef.current) {
      return;
    }
    
    // Skip fetch if already loaded
    if (hasLoaded && leaves.length > 0) {
      console.log(`Using cached leave data for employee ${employeeId}`);
      return;
    }
    
    // Set loading state and mark request as in progress
    setLoading(true);
    requestInProgressRef.current = true;

    try {
      console.log("Fetching leaves for employee:", employeeId);
      
      // Perform search by employeeId
      const result = await search('employeeId', employeeId);
      
      if (result.docs) {
        console.log(`Found ${result.docs.length} leave records for employee ${employeeId}`);
        
        // Sort results by start date in descending order
        const sortedLeaves = [...result.docs].sort((a, b) => {
          if (!a.startDate || !b.startDate) return 0;
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        });
        
        setLeaves(sortedLeaves);
        setHasLoaded(true);
        setError(null);
        
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
      setLeaves([]);
      toast({
        title: "Erreur",
        description: "Impossible de charger les congés de l'employé.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      requestInProgressRef.current = false;
    }
  }, [employeeId, search]);
  
  // Initial fetch when component mounts or employeeId changes
  useEffect(() => {
    if (employeeId) {
      fetchEmployeeLeaves();
    } else {
      // Reset state if no employeeId
      setLeaves([]);
      setTotalDays(0);
      setHasLoaded(false);
    }
  }, [employeeId, fetchEmployeeLeaves]);

  return {
    leaves,
    loading,
    error,
    totalDays,
    fetchLeaves: fetchEmployeeLeaves
  };
};
