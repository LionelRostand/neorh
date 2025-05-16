
import { useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { LeaveAllocation } from '../types';
import { allocationCache } from '../utils/leaveAllocationCache';
import { useRequestStateManager } from '../utils/requestStateManager';
import { useAllocationService } from '../api/allocationService';

type AllocationState = {
  allocation: LeaveAllocation | null;
  setAllocation: (allocation: LeaveAllocation | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  hasLoaded: boolean;
  setHasLoaded: (loaded: boolean) => void;
  retryCount: number;
  setRetryCount: (count: number) => void;
};

/**
 * Custom hook for fetching allocation data
 */
export const useAllocationFetch = (
  employeeId: string,
  state: AllocationState
) => {
  const MAX_RETRIES = 3;
  const {
    allocation,
    setAllocation,
    loading,
    setLoading,
    hasLoaded,
    setHasLoaded,
    retryCount,
    setRetryCount
  } = state;

  const {
    isRequestInProgress,
    setRequestInProgress,
    isMounted,
    setupMountState,
    clearDebounceTimer
  } = useRequestStateManager();

  const {
    fetchEmployeeAllocation,
    createDefaultAllocation
  } = useAllocationService();

  const fetchAllocation = useCallback(async () => {
    // Skip fetch if not mounted or no employeeId
    if (!isMounted() || !employeeId) {
      console.log('[useAllocationFetch] Skip fetch: component unmounted or no employeeId');
      return null;
    }
    
    // Skip fetch if request already in progress
    if (isRequestInProgress()) {
      console.log(`[useAllocationFetch] Request in progress for ${employeeId}, skipping`);
      return null;
    }
    
    console.log(`[useAllocationFetch] Starting fetch for employee ${employeeId}`);
    
    // Clear any existing debounce timer
    clearDebounceTimer();
    
    // Set loading state
    setLoading(true);
    
    // Check cache first
    const cachedData = allocationCache.get(employeeId);
    if (cachedData) {
      console.log(`[useAllocationFetch] Using cached allocation data for employee ${employeeId}`, cachedData);
      setAllocation(cachedData as LeaveAllocation);
      setHasLoaded(true);
      setLoading(false);
      return cachedData;
    }
    
    // Use debounce to prevent rapid successive calls
    return new Promise<LeaveAllocation | null>((resolve) => {
      // Mark request as in progress immediately
      setRequestInProgress(true);
      
      const fetchData = async () => {
        try {
          console.log(`[useAllocationFetch] Fetching allocation data from service for employee ${employeeId}`);
          // Get allocation for current year
          const currentAllocation = await fetchEmployeeAllocation(employeeId);
          
          // Skip if component unmounted during fetch
          if (!isMounted()) {
            resolve(null);
            return;
          }
          
          if (currentAllocation) {
            console.log(`[useAllocationFetch] Found allocation for employee ${employeeId}`, currentAllocation);
            
            // Update cache
            allocationCache.set(employeeId, currentAllocation);
            
            setAllocation(currentAllocation);
            setHasLoaded(true);
            setLoading(false);
            resolve(currentAllocation);
          } else {
            console.log(`[useAllocationFetch] No allocation found for employee ${employeeId}, will retry: ${retryCount}`);
            
            // Implement retry logic with exponential backoff
            if (retryCount < MAX_RETRIES) {
              setRetryCount(prev => prev + 1);
              const delay = Math.pow(2, retryCount) * 500; // 500ms, 1s, 2s, 4s
              
              setTimeout(() => {
                if (isMounted()) {
                  setRequestInProgress(false);
                  fetchAllocation().then(resolve);
                }
              }, delay);
            } else {
              // Create default allocation as last resort
              try {
                console.log(`[useAllocationFetch] Creating default allocation after max retries`);
                const defaultAllocation = await createDefaultAllocation(employeeId);
                
                if (defaultAllocation && isMounted()) {
                  setAllocation(defaultAllocation);
                  allocationCache.set(employeeId, defaultAllocation);
                }
              } catch (err) {
                console.error("[useAllocationFetch] Failed to create default allocation:", err);
              } finally {
                if (isMounted()) {
                  setLoading(false);
                  setHasLoaded(true);
                  resolve(null);
                }
              }
            }
          }
        } catch (err) {
          // Skip if component unmounted during error
          if (!isMounted()) {
            resolve(null);
            return;
          }
          
          console.error("[useAllocationFetch] Error fetching leave allocations:", err);
          
          // Implement retry logic
          if (retryCount < MAX_RETRIES) {
            setRetryCount(prev => prev + 1);
            const delay = Math.pow(2, retryCount) * 500;
            
            setTimeout(() => {
              if (isMounted()) {
                setRequestInProgress(false);
                fetchAllocation().then(resolve);
              }
            }, delay);
          } else {
            // Final attempt to create default allocation
            try {
              console.log(`[useAllocationFetch] Creating default allocation after error and max retries`);
              createDefaultAllocation(employeeId).then(defaultAllocation => {
                if (defaultAllocation && isMounted()) {
                  setAllocation(defaultAllocation);
                  allocationCache.set(employeeId, defaultAllocation);
                }
                setLoading(false);
                setHasLoaded(true);
                resolve(defaultAllocation);
              });
            } catch (fallbackErr) {
              if (isMounted()) {
                console.error("[useAllocationFetch] Final fallback failed:", fallbackErr);
                setLoading(false);
                setHasLoaded(true);
                resolve(null);
              }
            }
          }
        } finally {
          // Skip if component unmounted
          if (isMounted()) {
            setRequestInProgress(false);
          }
        }
      };
      
      // Start fetching after a short delay
      setTimeout(fetchData, 100);
    });
  }, [
    employeeId, isMounted, isRequestInProgress, retryCount, 
    clearDebounceTimer, fetchEmployeeAllocation, createDefaultAllocation, 
    setRequestInProgress, setAllocation, setHasLoaded, setLoading, setRetryCount
  ]);

  return {
    fetchAllocation,
    setupMountState
  };
};
