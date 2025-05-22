
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useLeaveAllocation, useEmployeeLeaveData, useLeaveTypeLabels } from './leaves';
import { HR } from '@/lib/constants/collections';

// Re-export LeaveAllocation interface for backward compatibility
export type { LeaveAllocation } from './leaves';

export const useEmployeeLeaves = (employeeId: string) => {
  // Reference to track if the hook is mounted
  const isMountedRef = useRef(true);
  // Reference to control data loading state
  const dataLoadedRef = useRef(false);
  // Reference to prevent multiple fetches for the same employee ID
  const lastFetchedIdRef = useRef<string>("");

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
    
    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      dataLoadedRef.current = false;
    };
  }, []);

  // Contrôle des appels pour éviter les boucles infinies
  useEffect(() => {
    if (!employeeId || !isMountedRef.current || employeeId === lastFetchedIdRef.current) {
      return;
    }

    console.log(`[useEmployeeLeaves] Fetching data for employee: ${employeeId}`);
    lastFetchedIdRef.current = employeeId;
    dataLoadedRef.current = true;
    
    // Load leaves and allocations in parallel
    Promise.all([
      fetchLeaves(),
      fetchAllocation()
    ]).catch(err => {
      console.error(`[useEmployeeLeaves] Error during fetch:`, err);
    });
  }, [employeeId, fetchLeaves, fetchAllocation]);

  // Use useCallback for refetch function to avoid unnecessary rerenders
  const refetch = useCallback(() => {
    if (!employeeId || !isMountedRef.current) {
      return;
    }
    
    console.log(`[useEmployeeLeaves] Manual refetch for employee: ${employeeId}`);
    
    // Load leaves and allocations in parallel
    Promise.all([
      fetchLeaves(),
      fetchAllocation()
    ]).catch(err => {
      console.error(`[useEmployeeLeaves] Error during refetch:`, err);
    });
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
