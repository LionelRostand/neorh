
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useLeaveAllocation, useEmployeeLeaveData, useLeaveTypeLabels } from './leaves';

// Re-export LeaveAllocation interface for backward compatibility
export type { LeaveAllocation } from './leaves/useLeaveAllocation';

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
    
    // Only load once on mount if data hasn't been loaded
    if (employeeId && !dataLoadedRef.current) {
      console.log(`[useEmployeeLeaves] Initial fetch for employee: ${employeeId}`);
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
      // Load leaves and allocations in parallel
      fetchLeaves();
      fetchAllocation().then(data => {
        console.log(`[useEmployeeLeaves] Allocation data refetched:`, data);
      }).catch(err => {
        console.error(`[useEmployeeLeaves] Error refetching allocation:`, err);
      });
      // Mark data as loaded
      dataLoadedRef.current = true;
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
