
import { useState, useCallback, useEffect, useRef } from 'react';
import { useFirestore } from '../firestore';
import { toast } from '@/components/ui/use-toast';

export interface LeaveAllocation {
  id?: string;
  employeeId: string;
  year: number;
  paidLeavesTotal: number;
  paidLeavesUsed: number;
  rttTotal: number;
  rttUsed: number;
  updatedAt: string;
  updatedBy?: string;
}

export const useLeaveAllocation = (employeeId: string) => {
  const [allocation, setAllocation] = useState<LeaveAllocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const requestInProgressRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { 
    search: searchAllocation,
    add: addAllocation,
    update: updateAllocation
  } = useFirestore<LeaveAllocation>('hr_leave_allocations');

  const fetchAllocation = useCallback(async () => {
    // Skip fetch if no employeeId
    if (!employeeId) {
      return null;
    }
    
    // Skip fetch if request already in progress
    if (requestInProgressRef.current) {
      console.log(`[useLeaveAllocation] Request in progress for ${employeeId}, skipping`);
      return null;
    }
    
    // Return cached data if already loaded
    if (hasLoaded && allocation !== null) {
      console.log(`[useLeaveAllocation] Using cached allocation data for employee ${employeeId}`);
      return allocation;
    }

    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Use debounce to prevent rapid successive calls
    return new Promise<LeaveAllocation | null>((resolve) => {
      debounceTimerRef.current = setTimeout(async () => {
        // Set loading state and mark request as in progress
        setLoading(true);
        requestInProgressRef.current = true;

        try {
          // Get allocation for current year
          const currentYear = new Date().getFullYear();
          console.log(`[useLeaveAllocation] Fetching leave allocations for employee ${employeeId}, year ${currentYear}`);
          const result = await searchAllocation('employeeId', employeeId);
          
          let currentAllocation = result.docs?.find(doc => doc.year === currentYear);
          
          if (currentAllocation) {
            console.log(`[useLeaveAllocation] Found existing allocation for employee ${employeeId}:`, currentAllocation);
            setAllocation(currentAllocation);
            setHasLoaded(true);
            resolve(currentAllocation);
          } else {
            // Create default allocation if none exists
            console.log(`[useLeaveAllocation] No allocation found for employee ${employeeId}, creating default`);
            const defaultAllocation: Omit<LeaveAllocation, 'id'> = {
              employeeId,
              year: currentYear,
              paidLeavesTotal: 25, // Default value for France
              paidLeavesUsed: 0,
              rttTotal: 12, // Default value (adjust as needed)
              rttUsed: 0,
              updatedAt: new Date().toISOString()
            };
            
            try {
              const newAllocationId = await addAllocation(defaultAllocation);
              
              if (newAllocationId) {
                const allocationId = typeof newAllocationId === 'string' 
                  ? newAllocationId 
                  : (newAllocationId as any).id || String(newAllocationId);
                  
                const newAllocation = { ...defaultAllocation, id: allocationId };
                setAllocation(newAllocation);
                setHasLoaded(true);
                resolve(newAllocation);
              } else {
                resolve(null);
              }
            } catch (err) {
              console.error("[useLeaveAllocation] Error creating allocation:", err);
              resolve(null);
            }
          }
        } catch (err) {
          console.error("[useLeaveAllocation] Error fetching leave allocations:", err);
          resolve(null);
        } finally {
          setLoading(false);
          requestInProgressRef.current = false;
          debounceTimerRef.current = null;
        }
      }, 300); // 300ms debounce
    });
  }, [employeeId, searchAllocation, addAllocation, hasLoaded, allocation]);

  // Update leave allocations
  const updateLeaveAllocationWithCache = useCallback(async (updates: Partial<LeaveAllocation>) => {
    if (!allocation?.id) return false;
    
    try {
      console.log(`[useLeaveAllocation] Updating leave allocation for ${employeeId}:`, updates);
      await updateAllocation(allocation.id, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state immediately for a faster UI response
      setAllocation(prev => prev ? { ...prev, ...updates } : null);
      
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
  }, [allocation, updateAllocation, employeeId]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    allocation,
    loading,
    fetchAllocation,
    updateLeaveAllocation: updateLeaveAllocationWithCache
  };
};
