
import { useState } from 'react';
import { LeaveAllocation } from '../types';

/**
 * Custom hook to manage allocation state
 */
export const useAllocationState = () => {
  const [allocation, setAllocation] = useState<LeaveAllocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  return {
    allocation,
    setAllocation,
    loading,
    setLoading,
    hasLoaded,
    setHasLoaded,
    retryCount,
    setRetryCount
  };
};
