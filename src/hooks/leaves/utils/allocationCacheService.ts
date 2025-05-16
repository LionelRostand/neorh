
import { allocationCache } from './leaveAllocationCache';
import { LeaveAllocation } from '../types';

/**
 * Service for handling allocation cache operations
 */
export const allocationCacheService = {
  /**
   * Gets allocation from cache
   */
  getFromCache: (employeeId: string): LeaveAllocation | null => {
    console.log(`[allocationCacheService] Checking cache for employee ${employeeId}`);
    const cachedData = allocationCache.get(employeeId);
    
    if (cachedData) {
      console.log(`[allocationCacheService] Cache hit for employee ${employeeId}`);
      return cachedData as LeaveAllocation;
    }
    
    console.log(`[allocationCacheService] Cache miss for employee ${employeeId}`);
    return null;
  },
  
  /**
   * Sets allocation in cache
   */
  setInCache: (employeeId: string, allocation: LeaveAllocation): void => {
    console.log(`[allocationCacheService] Updating cache for employee ${employeeId}`);
    allocationCache.set(employeeId, allocation);
  }
};
