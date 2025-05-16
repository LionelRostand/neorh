
import { useState, useCallback, useEffect, useRef } from 'react';
import { Leave } from '@/lib/constants';
import { useFirestore } from '../firestore';

export const useEmployeeLeaveData = (employeeId: string) => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalDays, setTotalDays] = useState(0);
  const requestInProgressRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const dataLoadedRef = useRef(false);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;
  
  const { search } = useFirestore<Leave>('hr_leaves');

  const fetchEmployeeLeaves = useCallback(async () => {
    // Skip if already loaded, not mounted, or no employeeId
    if (dataLoadedRef.current || !mountedRef.current || !employeeId) {
      return;
    }
    
    // Skip fetch if request already in progress
    if (requestInProgressRef.current) {
      console.log(`[useEmployeeLeaveData] Request in progress for ${employeeId}, skipping`);
      return;
    }
    
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // Set loading state and mark request as in progress
    setLoading(true);
    requestInProgressRef.current = true;

    try {
      console.log("[useEmployeeLeaveData] Fetching leaves for employee:", employeeId);
      
      // Perform search by employeeId
      const result = await search('employeeId', employeeId);
      
      // Skip if component unmounted during fetch
      if (!mountedRef.current) return;
      
      if (result.docs && result.docs.length > 0) {
        console.log(`[useEmployeeLeaveData] Found ${result.docs.length} leave records for employee ${employeeId}`);
        
        // Sort results by start date in descending order
        const sortedLeaves = [...result.docs].sort((a, b) => {
          if (!a.startDate || !b.startDate) return 0;
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        });
        
        setLeaves(sortedLeaves);
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
      } else {
        console.log(`[useEmployeeLeaveData] No leaves found for employee ${employeeId}`);
        setLeaves([]);
        setTotalDays(0);
      }
      
      // Mark data as loaded to prevent further fetches
      dataLoadedRef.current = true;
    } catch (err) {
      // Skip if component unmounted during error
      if (!mountedRef.current) return;
      
      console.error("[useEmployeeLeaveData] Error fetching employee leaves:", err);
      
      // Implement retry logic with exponential backoff
      if (retryCountRef.current < MAX_RETRIES) {
        const retryDelay = Math.pow(2, retryCountRef.current) * 500; // 500ms, 1s, 2s, 4s
        console.log(`[useEmployeeLeaveData] Retry ${retryCountRef.current + 1}/${MAX_RETRIES} in ${retryDelay}ms`);
        
        retryCountRef.current += 1;
        debounceTimerRef.current = setTimeout(() => {
          if (mountedRef.current) {
            requestInProgressRef.current = false;
            fetchEmployeeLeaves();
          }
        }, retryDelay);
        
        return;
      }
      
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      setLeaves([]);
      retryCountRef.current = 0;
    } finally {
      // Skip if component unmounted during finally
      if (mountedRef.current) {
        setLoading(false);
        requestInProgressRef.current = false;
      }
    }
  }, [employeeId, search]);
  
  // Reset state when employeeId changes
  useEffect(() => {
    if (employeeId) {
      dataLoadedRef.current = false;
      retryCountRef.current = 0;
    }
  }, [employeeId]);
  
  // Setup mount tracking
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      // Cleanup on unmount
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
