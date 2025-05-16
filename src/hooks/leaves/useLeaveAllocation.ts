
import { useEffect } from 'react';
import { LeaveAllocation } from './types';
import { useAllocationState } from './hooks/useAllocationState';
import { useAllocationFetch } from './hooks/useAllocationFetch';
import { useAllocationUpdate } from './hooks/useAllocationUpdate';

export { type LeaveAllocation } from './types';

/**
 * Main hook for managing employee leave allocations
 */
export const useLeaveAllocation = (employeeId: string) => {
  // Use sub-hooks for state management
  const allocationState = useAllocationState();
  const { 
    allocation, 
    loading, 
    setRetryCount 
  } = allocationState;
  
  // Use sub-hooks for data fetching
  const { 
    fetchAllocation, 
    setupMountState 
  } = useAllocationFetch(employeeId, allocationState);
  
  // Use sub-hooks for data updates
  const { 
    updateLeaveAllocation 
  } = useAllocationUpdate(employeeId, allocation, allocationState.setAllocation);

  // Force a retry when employeeId changes
  useEffect(() => {
    if (employeeId) {
      // Reset retry count when employee changes
      setRetryCount(0);
      allocationState.setHasLoaded(false);
      allocationState.setLoading(true);
      console.log(`[useLeaveAllocation] Employee ID changed to ${employeeId}, forcing fetch`);
      fetchAllocation();
    }
    
    return setupMountState();
  }, [employeeId, setupMountState, fetchAllocation, setRetryCount, allocationState]);

  return {
    allocation,
    loading,
    fetchAllocation,
    updateLeaveAllocation
  };
};
