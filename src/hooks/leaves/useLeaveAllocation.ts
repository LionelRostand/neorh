
import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { LeaveAllocation } from './types';
import { allocationCache } from './utils/leaveAllocationCache';
import { useRequestStateManager } from './utils/requestStateManager';
import { useAllocationService } from './api/allocationService';

export { type LeaveAllocation } from './types';

export const useLeaveAllocation = (employeeId: string) => {
  const [allocation, setAllocation] = useState<LeaveAllocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  
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
    
    // Check cache first
    const cachedData = allocationCache.get(employeeId);
    if (cachedData) {
      console.log(`[useLeaveAllocation] Using cached allocation data for employee ${employeeId}`, cachedData);
      if (!allocation) {
        setAllocation(cachedData as LeaveAllocation);
        setHasLoaded(true);
      }
      return cachedData;
    }
    
    // Return already loaded data if available
    if (hasLoaded && allocation !== null) {
      console.log(`[useLeaveAllocation] Using loaded allocation data for employee ${employeeId}`, allocation);
      return allocation;
    }

    // Clear any existing debounce timer
    clearDebounceTimer();
    
    // Use debounce to prevent rapid successive calls
    return new Promise<LeaveAllocation | null>((resolve) => {
      debounceTimerRef.current = setTimeout(async () => {
        // Skip if component unmounted during debounce
        if (!isMounted()) {
          resolve(null);
          return;
        }
        
        // Set loading state and mark request as in progress
        setLoading(true);
        setRequestInProgress(true);

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
            console.log(`[useLeaveAllocation] Found existing allocation for employee ${employeeId}`, currentAllocation);
            
            // Update cache
            allocationCache.set(employeeId, currentAllocation);
            
            setAllocation(currentAllocation);
            setHasLoaded(true);
            resolve(currentAllocation);
          } else {
            console.log(`[useLeaveAllocation] No allocation found for employee ${employeeId}, creating default`);
            // Create default allocation if none exists
            try {
              const newAllocation = await createDefaultAllocation(employeeId);
              
              // Skip if component unmounted during add
              if (!isMounted()) {
                resolve(null);
                return;
              }
              
              if (newAllocation) {
                console.log(`[useLeaveAllocation] Created default allocation for employee ${employeeId}`, newAllocation);
                // Update cache
                allocationCache.set(employeeId, newAllocation);
                
                setAllocation(newAllocation);
                setHasLoaded(true);
                resolve(newAllocation);
              } else {
                console.log(`[useLeaveAllocation] Failed to create default allocation for employee ${employeeId}`);
                resolve(null);
              }
            } catch (err) {
              console.error("[useLeaveAllocation] Error creating allocation:", err);
              resolve(null);
            }
          }
        } catch (err) {
          // Skip if component unmounted during error
          if (!isMounted()) {
            resolve(null);
            return;
          }
          
          console.error("[useLeaveAllocation] Error fetching leave allocations:", err);
          resolve(null);
        } finally {
          // Skip if component unmounted
          if (isMounted()) {
            setLoading(false);
            setRequestInProgress(false);
          }
        }
      }, 500);
    });
  }, [employeeId, isMounted, isRequestInProgress, allocation, hasLoaded, 
      clearDebounceTimer, debounceTimerRef, fetchEmployeeAllocation, createDefaultAllocation]);

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

  // Reset mounted ref on mount and clear on unmount
  useEffect(() => {
    return setupMountState();
  }, [setupMountState]);

  return {
    allocation,
    loading,
    fetchAllocation,
    updateLeaveAllocation
  };
};
