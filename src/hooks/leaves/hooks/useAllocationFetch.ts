
import { useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { LeaveAllocation } from '../types';
import { useRequestUtils } from '../utils/requestUtils';
import { useRetryLogic } from '../utils/retryUtils';
import { allocationCacheService } from '../utils/allocationCacheService';
import { useAllocationService } from '../api/allocationService';

type AllocationState = {
  allocation: LeaveAllocation | null;
  setAllocation: (allocation: LeaveAllocation | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  hasLoaded: boolean;
  setHasLoaded: (loaded: boolean) => void;
};

/**
 * Custom hook for fetching allocation data
 */
export const useAllocationFetch = (
  employeeId: string,
  state: AllocationState
) => {
  const {
    allocation,
    setAllocation,
    loading,
    setLoading,
    hasLoaded,
    setHasLoaded
  } = state;

  const { executeRequest, setupMountState } = useRequestUtils();
  const { retryCount, canRetry, scheduleRetry } = useRetryLogic(3);
  const { fetchEmployeeAllocation, createDefaultAllocation } = useAllocationService();

  /**
   * Handles successful allocation fetch
   */
  const handleAllocationSuccess = useCallback((allocation: LeaveAllocation) => {
    console.log(`[useAllocationFetch] Found allocation for employee ${employeeId}`, allocation);
    
    // Update cache
    allocationCacheService.setInCache(employeeId, allocation);
    
    // Update state
    setAllocation(allocation);
    setHasLoaded(true);
    setLoading(false);
    
    return allocation;
  }, [employeeId, setAllocation, setHasLoaded, setLoading]);

  /**
   * Creates a default allocation as fallback
   */
  const createFallbackAllocation = useCallback(async () => {
    console.log(`[useAllocationFetch] Creating default allocation after max retries or error`);
    try {
      const defaultAllocation = await createDefaultAllocation(employeeId);
      
      if (defaultAllocation) {
        setAllocation(defaultAllocation);
        allocationCacheService.setInCache(employeeId, defaultAllocation);
      }
      
      return defaultAllocation;
    } catch (err) {
      console.error("[useAllocationFetch] Failed to create default allocation:", err);
      return null;
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  }, [employeeId, createDefaultAllocation, setAllocation, setLoading, setHasLoaded]);

  /**
   * Main fetch allocation function
   */
  const fetchAllocation = useCallback(async () => {
    // Skip if no employeeId
    if (!employeeId) {
      console.log('[useAllocationFetch] Skip fetch: no employeeId');
      return null;
    }
    
    console.log(`[useAllocationFetch] Starting fetch for employee ${employeeId}`);
    
    // Set loading state
    setLoading(true);
    
    // Check cache first
    const cachedData = allocationCacheService.getFromCache(employeeId);
    if (cachedData) {
      return handleAllocationSuccess(cachedData);
    }
    
    // Use debounce to prevent rapid successive calls
    return new Promise<LeaveAllocation | null>((resolve) => {
      const fetchData = async () => {
        try {
          console.log(`[useAllocationFetch] Fetching allocation data from service for employee ${employeeId}`);
          // Get allocation for current year
          const currentAllocation = await fetchEmployeeAllocation(employeeId);
          
          if (currentAllocation) {
            const result = handleAllocationSuccess(currentAllocation);
            resolve(result);
          } else {
            console.log(`[useAllocationFetch] No allocation found for employee ${employeeId}, will retry: ${retryCount}`);
            
            // Implement retry logic with exponential backoff
            if (canRetry()) {
              scheduleRetry(() => {
                fetchAllocation().then(resolve);
              });
            } else {
              // Create default allocation as last resort
              const defaultAllocation = await createFallbackAllocation();
              resolve(defaultAllocation);
            }
          }
        } catch (err) {
          console.error("[useAllocationFetch] Error fetching leave allocations:", err);
          
          // Implement retry logic
          if (canRetry()) {
            scheduleRetry(() => {
              fetchAllocation().then(resolve);
            });
          } else {
            // Final attempt to create default allocation
            const defaultAllocation = await createFallbackAllocation();
            resolve(defaultAllocation);
          }
        }
      };
      
      // Start fetching after a short delay to prevent rapid successive calls
      executeRequest(fetchData, employeeId, {
        onFinally: () => {
          // Ensure loading state is reset
          setLoading(false);
        }
      }).then(result => {
        if (result === null) {
          resolve(null);
        }
      });
    });
  }, [
    employeeId, 
    setLoading, 
    handleAllocationSuccess,
    executeRequest, 
    fetchEmployeeAllocation, 
    retryCount,
    canRetry, 
    scheduleRetry,
    createFallbackAllocation
  ]);

  return {
    fetchAllocation,
    setupMountState
  };
};
