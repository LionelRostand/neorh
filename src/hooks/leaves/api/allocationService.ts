
import { useFirestore } from '@/hooks/firestore';
import { LeaveAllocation } from '../types';

export function useAllocationService() {
  const { 
    search: searchAllocation,
    add: addAllocation,
    update: updateAllocation
  } = useFirestore<LeaveAllocation>('hr_leave_allocations');
  
  /**
   * Fetches an allocation for a specific employee and year
   */
  const fetchEmployeeAllocation = async (employeeId: string, year?: number) => {
    const currentYear = year || new Date().getFullYear();
    console.log(`[allocationService] Fetching leave allocations for employee ${employeeId}, year ${currentYear}`);
    
    const result = await searchAllocation('employeeId', employeeId);
    return result.docs?.find(doc => doc.year === currentYear) || null;
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
      updatedAt: new Date().toISOString()
    };
    
    const newAllocationId = await addAllocation(defaultAllocation);
    if (newAllocationId) {
      const allocationId = typeof newAllocationId === 'string' 
        ? newAllocationId 
        : (newAllocationId as any).id || String(newAllocationId);
        
      return { ...defaultAllocation, id: allocationId };
    }
    
    return null;
  };
  
  /**
   * Updates an existing allocation
   */
  const updateAllocationData = async (
    allocationId: string, 
    updates: Partial<LeaveAllocation>
  ) => {
    return await updateAllocation(allocationId, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  };
  
  return {
    fetchEmployeeAllocation,
    createDefaultAllocation,
    updateAllocationData
  };
}
