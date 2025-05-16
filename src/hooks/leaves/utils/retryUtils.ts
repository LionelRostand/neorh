
import { useState, useCallback } from 'react';

/**
 * Hook for managing retries with exponential backoff
 */
export function useRetryLogic(maxRetries: number = 3) {
  const [retryCount, setRetryCount] = useState(0);
  
  /**
   * Checks if more retries are available
   */
  const canRetry = useCallback(() => {
    return retryCount < maxRetries;
  }, [retryCount, maxRetries]);
  
  /**
   * Increments the retry counter
   */
  const incrementRetry = useCallback(() => {
    // Use direct value to avoid TypeScript errors
    setRetryCount(retryCount + 1);
    return retryCount + 1;
  }, [retryCount]);
  
  /**
   * Resets the retry counter
   */
  const resetRetry = useCallback(() => {
    setRetryCount(0);
  }, []);
  
  /**
   * Gets the delay time in ms for the current retry
   */
  const getRetryDelay = useCallback(() => {
    // Exponential backoff: 500ms, 1s, 2s, 4s...
    return Math.pow(2, retryCount) * 500;
  }, [retryCount]);
  
  /**
   * Schedules a retry with exponential backoff
   */
  const scheduleRetry = useCallback((callback: () => void, checkMountedFn?: () => boolean) => {
    const newRetryCount = incrementRetry();
    const delay = Math.pow(2, newRetryCount - 1) * 500;
    
    console.log(`[retryUtils] Scheduling retry #${newRetryCount} with delay ${delay}ms`);
    
    setTimeout(() => {
      // Skip if component unmounted or unmounted check is provided and returns false
      if (!checkMountedFn || checkMountedFn()) {
        callback();
      }
    }, delay);
  }, [incrementRetry]);
  
  return {
    retryCount,
    setRetryCount,
    canRetry,
    incrementRetry,
    resetRetry,
    getRetryDelay,
    scheduleRetry
  };
}
