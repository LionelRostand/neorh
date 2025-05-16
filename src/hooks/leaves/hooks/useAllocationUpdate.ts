
import { useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { LeaveAllocation } from '../types';
import { allocationCache } from '../utils/leaveAllocationCache';
import { useAllocationService } from '../api/allocationService';

/**
 * Custom hook for updating allocation data
 */
export const useAllocationUpdate = (
  employeeId: string,
  allocation: LeaveAllocation | null,
  setAllocation: (allocation: LeaveAllocation | null) => void
) => {
  const { updateAllocationData } = useAllocationService();

  const updateLeaveAllocation = useCallback(async (updates: Partial<LeaveAllocation>) => {
    if (!allocation?.id) return false;
    
    try {
      console.log(`[useAllocationUpdate] Updating leave allocation for ${employeeId}:`, updates);
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
      console.error("[useAllocationUpdate] Error updating leave allocations:", err);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les allocations de congés.",
        variant: "destructive"
      });
      return false;
    }
  }, [allocation, updateAllocationData, employeeId, setAllocation]);

  return { 
    updateLeaveAllocation 
  };
};
