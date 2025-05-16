import { useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { LeaveAllocation } from '../types';
import { allocationCache } from '../utils/leaveAllocationCache';
import { useAllocationService } from '../api/allocationService';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Leave } from '@/types/firebase'; // Added import

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

  /**
   * Cette fonction met à jour l'allocation lorsqu'une demande de congé est approuvée
   */
  const updateLeaveAllocationOnApproval = useCallback(async (leaveId: string, leaveType: string, daysRequested: number) => {
    if (!allocation?.id || !employeeId) return false;

    try {
      console.log(`[useAllocationUpdate] Updating allocation on leave approval: ${leaveType}, ${daysRequested} days`);
      
      // Mettre à jour les jours utilisés selon le type de congé
      const updates: Partial<LeaveAllocation> = {};
      
      if (leaveType === 'paid') {
        updates.paidLeavesUsed = (allocation.paidLeavesUsed || 0) + daysRequested;
      } else if (leaveType === 'rtt') {
        updates.rttUsed = (allocation.rttUsed || 0) + daysRequested;
      }
      
      // S'il n'y a pas de mise à jour à faire, sortir
      if (Object.keys(updates).length === 0) return true;
      
      return await updateLeaveAllocation(updates);
    } catch (err) {
      console.error("[useAllocationUpdate] Error updating allocation on leave approval:", err);
      return false;
    }
  }, [allocation, employeeId, updateLeaveAllocation]);

  return { 
    updateLeaveAllocation,
    updateLeaveAllocationOnApproval
  };
};
