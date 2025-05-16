
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useLeaveAllocation, useEmployeeLeaveData, useLeaveTypeLabels } from './leaves';

// Re-export LeaveAllocation interface for backward compatibility
export type { LeaveAllocation } from './leaves/useLeaveAllocation';

export const useEmployeeLeaves = (employeeId: string) => {
  const [shouldFetch, setShouldFetch] = useState(true);

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

  // Utiliser useEffect pour contrôler le chargement initial, une seule fois
  useEffect(() => {
    if (employeeId && shouldFetch) {
      console.log(`[useEmployeeLeaves] Initial fetch for employee: ${employeeId}`);
      // Load leaves and allocations in parallel
      fetchLeaves();
      fetchAllocation();
      // Désactiver les fetches automatiques après le premier chargement
      setShouldFetch(false);
    }
  }, [employeeId, fetchLeaves, fetchAllocation, shouldFetch]);

  // Utiliser useCallback pour la fonction fetchData afin d'éviter des rendus inutiles
  const refetch = useCallback(() => {
    if (employeeId) {
      console.log(`[useEmployeeLeaves] Manual refetch for employee: ${employeeId}`);
      // Load leaves and allocations in parallel
      fetchLeaves();
      fetchAllocation();
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
