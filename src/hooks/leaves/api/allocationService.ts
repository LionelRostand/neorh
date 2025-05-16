
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
      // Add more detailed logging
      console.log(`[allocationService] Searching in collection 'hr_leave_allocations' for employeeId=${employeeId}`);
      
      const result = await searchAllocation('employeeId', employeeId);
      console.log(`[allocationService] Search result for employee ${employeeId}:`, result);
      
      if (result.docs && result.docs.length > 0) {
        console.log(`[allocationService] Found ${result.docs.length} allocations for employee ${employeeId}`);
        
        const yearAllocation = result.docs.find(doc => doc.year === currentYear);
        
        if (yearAllocation) {
          console.log(`[allocationService] Found allocation for employee ${employeeId}, year ${currentYear}`, yearAllocation);
          return yearAllocation;
        } else {
          console.log(`[allocationService] No allocation for employee ${employeeId} for year ${currentYear}, creating default`);
          // If no allocation found for the current year but employee has other allocations,
          // create a default one for the current year
          return await createDefaultAllocation(employeeId, currentYear);
        }
      } else {
        console.log(`[allocationService] No allocations found for employee ${employeeId}, creating default`);
        // Create default allocation since none exists
        return await createDefaultAllocation(employeeId, currentYear);
      }
    } catch (error) {
      console.error(`[allocationService] Error fetching allocation for employee ${employeeId}:`, error);
      // Create a default allocation as fallback strategy instead of returning null
      console.log(`[allocationService] Creating default allocation as fallback after error`);
      try {
        return await createDefaultAllocation(employeeId, currentYear);
      } catch (fallbackError) {
        console.error(`[allocationService] Error creating fallback allocation:`, fallbackError);
        return null;
      }
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
      rttTotal: 12, // Default value for France
      rttUsed: 0,
      updatedAt: new Date().toISOString(),
      // Only add updatedBy if defined
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
      throw error; // Propagate error to caller instead of returning null
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
    
    // Only add updatedBy if defined
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
