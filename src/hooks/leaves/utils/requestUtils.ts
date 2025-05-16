
import { useCallback } from 'react';
import { useRequestStateManager } from './requestStateManager';

/**
 * Hook for managing request execution with debounce and mounted state checks
 */
export function useRequestUtils() {
  const {
    isRequestInProgress,
    setRequestInProgress,
    isMounted,
    setupMountState,
    clearDebounceTimer
  } = useRequestStateManager();
  
  /**
   * Executes a request with proper state management
   */
  const executeRequest = useCallback(async <T>(
    requestFn: () => Promise<T>,
    employeeId: string,
    options: {
      onRequestStart?: () => void;
      onSuccess?: (data: T) => void;
      onError?: (error: any) => void;
      onFinally?: () => void;
    } = {}
  ): Promise<T | null> => {
    // Skip if not mounted or no employeeId
    if (!isMounted() || !employeeId) {
      console.log('[useRequestUtils] Skip: component unmounted or no employeeId');
      return null;
    }
    
    // Skip if request already in progress
    if (isRequestInProgress()) {
      console.log(`[useRequestUtils] Request in progress for ${employeeId}, skipping`);
      return null;
    }
    
    console.log(`[useRequestUtils] Starting request for ${employeeId}`);
    
    // Clear any existing debounce timer
    clearDebounceTimer();
    
    // Call onRequestStart if provided
    if (options.onRequestStart) {
      options.onRequestStart();
    }
    
    // Mark request as in progress
    setRequestInProgress(true);
    
    try {
      // Execute the request
      const result = await requestFn();
      
      // Skip if component unmounted during request
      if (!isMounted()) {
        return null;
      }
      
      // Call onSuccess if provided
      if (options.onSuccess && result) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (error) {
      // Skip if component unmounted during error
      if (!isMounted()) {
        return null;
      }
      
      console.error('[useRequestUtils] Request error:', error);
      
      // Call onError if provided
      if (options.onError) {
        options.onError(error);
      }
      
      return null;
    } finally {
      // Skip if component unmounted
      if (isMounted()) {
        // Call onFinally if provided
        if (options.onFinally) {
          options.onFinally();
        }
        
        setRequestInProgress(false);
      }
    }
  }, [isMounted, isRequestInProgress, clearDebounceTimer, setRequestInProgress]);
  
  return {
    executeRequest,
    setupMountState
  };
}
