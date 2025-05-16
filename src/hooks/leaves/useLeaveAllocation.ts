
import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { LeaveAllocation } from './types';
import { allocationCache } from './utils/leaveAllocationCache';
import { useRequestStateManager } from './utils/requestStateManager';
import { useAllocationService } from './api/allocationService';

export { type LeaveAllocation } from './types';

export const useLeaveAllocation = (employeeId: string) => {
  const [allocation, setAllocation] = useState<LeaveAllocation | null>(null);
  const [loading, setLoading] = useState(true);  // Start with loading true
  const [hasLoaded, setHasLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  
  const { 
    isRequestInProgress, 
    setRequestInProgress,
    isMounted,
    setupMountState,
    debounceTimerRef,
    clearDebounceTimer
  } = useRequestStateManager();
  
  const { 
    fetchEmployeeAllocation,
    createDefaultAllocation,
    updateAllocationData
  } = useAllocationService();

  const fetchAllocation = useCallback(async () => {
    // Skip fetch if not mounted or no employeeId
    if (!isMounted() || !employeeId) {
      console.log('[useLeaveAllocation] Skip fetch: component unmounted or no employeeId');
      return null;
    }
    
    // Skip fetch if request already in progress
    if (isRequestInProgress()) {
      console.log(`[useLeaveAllocation] Request in progress for ${employeeId}, skipping`);
      return null;
    }
    
    console.log(`[useLeaveAllocation] Starting fetch for employee ${employeeId}`);
    
    // Clear any existing debounce timer
    clearDebounceTimer();
    
    // Set loading state
    setLoading(true);
    
    // Check cache first
    const cachedData = allocationCache.get(employeeId);
    if (cachedData) {
      console.log(`[useLeaveAllocation] Using cached allocation data for employee ${employeeId}`, cachedData);
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
          console.log(`[useLeaveAllocation] Fetching allocation data from service for employee ${employeeId}`);
          // Get allocation for current year
          const currentAllocation = await fetchEmployeeAllocation(employeeId);
          
          // Skip if component unmounted during fetch
          if (!isMounted()) {
            resolve(null);
            return;
          }
          
          if (currentAllocation) {
            console.log(`[useLeaveAllocation] Found allocation for employee ${employeeId}`, currentAllocation);
            
            // Update cache
            allocationCache.set(employeeId, currentAllocation);
            
            setAllocation(currentAllocation);
            setHasLoaded(true);
            setLoading(false);
            resolve(currentAllocation);
          } else {
            console.log(`[useLeaveAllocation] No allocation found for employee ${employeeId}, will retry: ${retryCount}`);
            
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
                console.log(`[useLeaveAllocation] Creating default allocation after max retries`);
                const defaultAllocation = await createDefaultAllocation(employeeId);
                
                if (defaultAllocation && isMounted()) {
                  setAllocation(defaultAllocation);
                  allocationCache.set(employeeId, defaultAllocation);
                }
              } catch (err) {
                console.error("[useLeaveAllocation] Failed to create default allocation:", err);
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
          
          console.error("[useLeaveAllocation] Error fetching leave allocations:", err);
          
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
              console.log(`[useLeaveAllocation] Creating default allocation after error and max retries`);
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
                console.error("[useLeaveAllocation] Final fallback failed:", fallbackErr);
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
  }, [employeeId, isMounted, isRequestInProgress, retryCount,
      clearDebounceTimer, fetchEmployeeAllocation, createDefaultAllocation, setRequestInProgress]);

  // Update leave allocations
  const updateLeaveAllocation = useCallback(async (updates: Partial<LeaveAllocation>) => {
    if (!allocation?.id) return false;
    
    try {
      console.log(`[useLeaveAllocation] Updating leave allocation for ${employeeId}:`, updates);
      await updateAllocationData(allocation.id, updates);
      
      // Update local state immediately for a faster UI response
      const updatedAllocation = { ...allocation, ...updates };
      setAllocation(updatedAllocation);
      
      // Update cache
      if (employeeId) {
        allocationCache.set(employeeId, updatedAllocation);
      }
      
      toast({
        title: "Succès",
        description: "Les allocations de congés ont été mises à jour.",
      });
      
      return true;
    } catch (err) {
      console.error("[useLeaveAllocation] Error updating leave allocations:", err);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les allocations de congés.",
        variant: "destructive"
      });
      return false;
    }
  }, [allocation, updateAllocationData, employeeId]);

  // Force a retry when employeeId changes
  useEffect(() => {
    if (employeeId) {
      // Reset retry count when employee changes
      setRetryCount(0);
      setHasLoaded(false);
      setLoading(true);
      console.log(`[useLeaveAllocation] Employee ID changed to ${employeeId}, forcing fetch`);
      fetchAllocation();
    }
    
    return setupMountState();
  }, [employeeId, setupMountState, fetchAllocation]);

  return {
    allocation,
    loading,
    fetchAllocation,
    updateLeaveAllocation
  };
};
