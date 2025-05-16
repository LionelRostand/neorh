
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useLeaveAllocation, useEmployeeLeaveData, useLeaveTypeLabels } from './leaves';

// Re-export LeaveAllocation interface for backward compatibility
export type { LeaveAllocation } from './leaves';

export const useEmployeeLeaves = (employeeId: string) => {
  // Reference to track if the hook is mounted
  const isMountedRef = useRef(true);
  // Reference to control if data has already been loaded
  const dataLoadedRef = useRef(false);

  // Use our smaller hooks with stabilized inputs
  const { 
    leaves,
    loading: leavesLoading,
    error,
    totalDays,
    fetchLeaves
  } = useEmployeeLeaveData(employeeId);

  const {
    allocation,
    loading: allocationLoading,
    fetchAllocation,
    updateLeaveAllocation
  } = useLeaveAllocation(employeeId);

  const {
    getLeaveTypeLabel
  } = useLeaveTypeLabels();

  // Use useEffect to control initial loading, only once
  useEffect(() => {
    // Mark component as mounted
    isMountedRef.current = true;
    
    // Force immediate loading on mount
    if (employeeId) {
      console.log(`[useEmployeeLeaves] Initial fetch for employee: ${employeeId}`);
      // Reset loaded flag to ensure fresh data
      dataLoadedRef.current = false;
      // Load leaves and allocations in parallel
      fetchLeaves();
      fetchAllocation().then(data => {
        console.log(`[useEmployeeLeaves] Allocation data fetched:`, data);
      }).catch(err => {
        console.error(`[useEmployeeLeaves] Error fetching allocation:`, err);
      });
      // Mark data as loaded
      dataLoadedRef.current = true;
    }
    
    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
    };
  }, [employeeId, fetchLeaves, fetchAllocation]);

  // Use useCallback for refetch function to avoid unnecessary rerenders
  const refetch = useCallback(() => {
    if (employeeId && isMountedRef.current) {
      console.log(`[useEmployeeLeaves] Manual refetch for employee: ${employeeId}`);
      // Reset data loaded flag to force refetch
      dataLoadedRef.current = false;
      
      // Load leaves and allocations in parallel with explicit promises
      Promise.all([
        fetchLeaves(),
        fetchAllocation().then(data => {
          console.log(`[useEmployeeLeaves] Allocation data refetched:`, data);
          return data;
        })
      ]).catch(err => {
        console.error(`[useEmployeeLeaves] Error during refetch:`, err);
      }).finally(() => {
        // Mark data as loaded
        dataLoadedRef.current = true;
      });
    }
  }, [employeeId, fetchLeaves, fetchAllocation]);

  // Memoize derived values to prevent unnecessary re-renders
  const paidLeavesRemaining = useMemo(() => {
    return allocation ? allocation.paidLeavesTotal - allocation.paidLeavesUsed : 0;
  }, [allocation]);

  const rttRemaining = useMemo(() => {
    return allocation ? allocation.rttTotal - allocation.rttUsed : 0;
  }, [allocation]);

  return {
    leaves,
    loading: leavesLoading || allocationLoading,
    error,
    totalDays,
    allocation,
    allocationLoading,
    getLeaveTypeLabel,
    refetch,
    updateLeaveAllocation,
    paidLeavesRemaining,
    paidLeavesTotal: allocation?.paidLeavesTotal || 0,
    rttRemaining,
    rttTotal: allocation?.rttTotal || 0
  };
};
