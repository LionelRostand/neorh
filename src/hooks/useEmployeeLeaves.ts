
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useLeaveAllocation, useEmployeeLeaveData, useLeaveTypeLabels } from './leaves';

// Re-export LeaveAllocation interface for backward compatibility
export type { LeaveAllocation } from './leaves/useLeaveAllocation';

export const useEmployeeLeaves = (employeeId: string) => {
  // Référence pour suivre si le hook est monté
  const isMountedRef = useRef(true);
  // Référence pour contrôler si les données ont déjà été chargées
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

  // Utiliser useEffect pour contrôler le chargement initial, une seule fois
  useEffect(() => {
    // Marquer le composant comme monté
    isMountedRef.current = true;
    
    // Ne charger qu'une fois au montage si les données n'ont pas été chargées
    if (employeeId && !dataLoadedRef.current) {
      console.log(`[useEmployeeLeaves] Initial fetch for employee: ${employeeId}`);
      // Load leaves and allocations in parallel
      fetchLeaves();
      fetchAllocation().then(data => {
        console.log(`[useEmployeeLeaves] Allocation data fetched:`, data);
      }).catch(err => {
        console.error(`[useEmployeeLeaves] Error fetching allocation:`, err);
      });
      // Marquer les données comme chargées
      dataLoadedRef.current = true;
    }
    
    // Nettoyage lors du démontage
    return () => {
      isMountedRef.current = false;
    };
  }, [employeeId, fetchLeaves, fetchAllocation]);

  // Utiliser useCallback pour la fonction fetchData afin d'éviter des rendus inutiles
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
      // Marquer les données comme chargées
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
