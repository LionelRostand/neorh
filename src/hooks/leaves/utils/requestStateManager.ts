
import { useRef } from 'react';

export function useRequestStateManager() {
  const requestInProgressRef = useRef(false);
  const mountedRef = useRef(true);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const setRequestInProgress = (inProgress: boolean) => {
    requestInProgressRef.current = inProgress;
  };
  
  const clearDebounceTimer = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  };
  
  // Set component as mounted on initialization and handle cleanup
  const setupMountState = () => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      clearDebounceTimer();
    };
  };
  
  return {
    isRequestInProgress: () => requestInProgressRef.current,
    setRequestInProgress,
    isMounted: () => mountedRef.current,
    setupMountState,
    debounceTimerRef,
    clearDebounceTimer
  };
}
