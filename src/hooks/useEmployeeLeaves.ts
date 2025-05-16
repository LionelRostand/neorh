
import { useEffect, useCallback } from 'react';
import { useLeaveAllocation, useEmployeeLeaveData, useLeaveTypeLabels } from './leaves';

// Re-export LeaveAllocation interface for backward compatibility
export type { LeaveAllocation } from './leaves/useLeaveAllocation';

export const useEmployeeLeaves = (employeeId: string) => {
  // Use our new smaller hooks
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

  // Utilisons useCallback pour la fonction fetchData afin d'éviter des rendus inutiles
  const fetchData = useCallback(() => {
    if (employeeId) {
      // Load leaves and allocations in parallel
      Promise.all([
        fetchLeaves(),
        fetchAllocation()
      ]);
    }
  }, [employeeId, fetchLeaves, fetchAllocation]);

  // Load data when the component mounts or when employeeId changes
  useEffect(() => {
    if (employeeId) {
      fetchData();
    }
    // Nous utilisons fetchData comme dépendance au lieu de fetchLeaves et fetchAllocation
    // pour éviter des appels répétés
  }, [employeeId, fetchData]);

  return {
    leaves,
    loading: leavesLoading,
    error,
    totalDays,
    allocation,
    allocationLoading,
    getLeaveTypeLabel,
    refetch: fetchData, // Utiliser fetchData au lieu de fetchLeaves
    updateLeaveAllocation
  };
};
