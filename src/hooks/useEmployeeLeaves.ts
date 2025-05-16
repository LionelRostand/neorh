
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

  // Utiliser useCallback pour la fonction fetchData afin d'éviter des rendus inutiles
  const fetchData = useCallback(() => {
    if (employeeId) {
      console.log(`Fetching leave data for employee: ${employeeId}`);
      // Load leaves and allocations in parallel
      fetchLeaves();
      fetchAllocation();
    }
  }, [employeeId, fetchLeaves, fetchAllocation]);

  // Load data when the component mounts or when employeeId changes
  useEffect(() => {
    if (employeeId) {
      fetchData();
    }
  }, [employeeId, fetchData]);

  return {
    leaves,
    loading: leavesLoading || allocationLoading,
    error,
    totalDays,
    allocation,
    allocationLoading,
    getLeaveTypeLabel,
    refetch: fetchData,
    updateLeaveAllocation
  };
};
