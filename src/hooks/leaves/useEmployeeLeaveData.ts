
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
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true); // Pour suivre si le composant est monté
  
  const { search } = useFirestore<Leave>('hr_leaves');

  const fetchEmployeeLeaves = useCallback(async () => {
    // Skip fetch if not mounted
    if (!mountedRef.current) {
      console.log('[useEmployeeLeaveData] Component unmounted, skipping fetch');
      return;
    }
    
    // Skip fetch if no employeeId
    if (!employeeId) {
      console.log('[useEmployeeLeaveData] No employeeId provided, skipping fetch');
      return;
    }
    
    // Skip fetch if request already in progress
    if (requestInProgressRef.current) {
      console.log(`[useEmployeeLeaveData] Request in progress for ${employeeId}, skipping`);
      return;
    }
    
    // Skip fetch if already loaded (returning cached data)
    if (hasLoaded && leaves.length > 0) {
      console.log(`[useEmployeeLeaveData] Using cached leave data for employee ${employeeId}`);
      return;
    }
    
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Use debounce to prevent rapid successive calls
    debounceTimerRef.current = setTimeout(async () => {
      // Skip if component unmounted during debounce
      if (!mountedRef.current) return;
      
      // Set loading state and mark request as in progress
      setLoading(true);
      requestInProgressRef.current = true;

      try {
        console.log("[useEmployeeLeaveData] Fetching leaves for employee:", employeeId);
        
        // Perform search by employeeId
        const result = await search('employeeId', employeeId);
        
        // Skip if component unmounted during fetch
        if (!mountedRef.current) return;
        
        if (result.docs) {
          console.log(`[useEmployeeLeaveData] Found ${result.docs.length} leave records for employee ${employeeId}`);
          
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
        // Skip if component unmounted during error
        if (!mountedRef.current) return;
        
        console.error("[useEmployeeLeaveData] Error fetching employee leaves:", err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        setLeaves([]);
      } finally {
        // Skip if component unmounted during finally
        if (!mountedRef.current) return;
        
        setLoading(false);
        requestInProgressRef.current = false;
        debounceTimerRef.current = null;
      }
    }, 500); // Increased debounce to 500ms for more stability

  }, [employeeId, search, hasLoaded, leaves.length]);
  
  useEffect(() => {
    // Reset mounted ref on mount
    mountedRef.current = true;
    
    // Cleanup function to cancel debounce timer and mark as unmounted
    return () => {
      mountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    leaves,
    loading,
    error,
    totalDays,
    fetchLeaves: fetchEmployeeLeaves
  };
};
