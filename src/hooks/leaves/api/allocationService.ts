
import { useFirestore } from '@/hooks/firestore';
import { LeaveAllocation } from '../types';
import { useAuth } from '@/hooks/useAuth';

export function useAllocationService() {
  const { 
    search: searchAllocation,
    add: addAllocation,
    update: updateAllocation,
    getAll: getAllAllocations
  } = useFirestore<LeaveAllocation>('hr_leave_allocations');
  
  const { user } = useAuth();
  
  /**
   * Fetches an allocation for a specific employee and year
   */
  const fetchEmployeeAllocation = async (employeeId: string, year?: number) => {
    const currentYear = year || new Date().getFullYear();
    console.log(`[allocationService] Fetching leave allocations for employee ${employeeId}, year ${currentYear}`);
    
    try {
      const result = await searchAllocation('employeeId', employeeId);
      console.log(`[allocationService] Search result for employee ${employeeId}:`, result);
      
      if (result.docs && result.docs.length > 0) {
        const yearAllocation = result.docs.find(doc => doc.year === currentYear);
        
        if (yearAllocation) {
          console.log(`[allocationService] Found allocation for employee ${employeeId}, year ${currentYear}`, yearAllocation);
          return yearAllocation;
        } else {
          console.log(`[allocationService] No allocation for employee ${employeeId} for year ${currentYear}`);
          return null;
        }
      } else {
        console.log(`[allocationService] No allocations found for employee ${employeeId}`);
        return null;
      }
    } catch (error) {
      console.error(`[allocationService] Error fetching allocation for employee ${employeeId}:`, error);
      return null;
    }
  };
  
  /**
   * Creates a default allocation for an employee
   */
  const createDefaultAllocation = async (employeeId: string, year?: number) => {
    console.log(`[allocationService] Creating default allocation for employee ${employeeId}`);
    const currentYear = year || new Date().getFullYear();
    
    const defaultAllocation: Omit<LeaveAllocation, 'id'> = {
      employeeId,
      year: currentYear,
      paidLeavesTotal: 25, // Default value for France
      paidLeavesUsed: 0,
      rttTotal: 12, // Default value
      rttUsed: 0,
      updatedAt: new Date().toISOString(),
      // Seulement ajouter updatedBy s'il est défini
      ...(user?.uid ? { updatedBy: user.uid } : {})
    };
    
    try {
      console.log(`[allocationService] Adding default allocation:`, defaultAllocation);
      const newAllocationId = await addAllocation(defaultAllocation);
      
      if (newAllocationId) {
        const allocationId = typeof newAllocationId === 'string' 
          ? newAllocationId 
          : (newAllocationId as any).id || String(newAllocationId);
          
        console.log(`[allocationService] Created allocation with ID: ${allocationId}`);
        return { ...defaultAllocation, id: allocationId };
      } else {
        console.log(`[allocationService] Failed to create allocation, no ID returned`);
        return null;
      }
    } catch (error) {
      console.error(`[allocationService] Error creating default allocation:`, error);
      return null;
    }
  };
  
  /**
   * Updates an existing allocation
   */
  const updateAllocationData = async (
    allocationId: string, 
    updates: Partial<LeaveAllocation>
  ) => {
    console.log(`[allocationService] Updating allocation ${allocationId} with:`, updates);
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Ajouter updatedBy seulement s'il est défini
    if (user?.uid) {
      updatesWithTimestamp.updatedBy = user.uid;
    }
    
    try {
      await updateAllocation(allocationId, updatesWithTimestamp);
      console.log(`[allocationService] Successfully updated allocation ${allocationId}`);
      return true;
    } catch (error) {
      console.error(`[allocationService] Error updating allocation ${allocationId}:`, error);
      throw error;
    }
  };
  
  return {
    fetchEmployeeAllocation,
    createDefaultAllocation,
    updateAllocationData,
    getAllAllocations
  };
}
