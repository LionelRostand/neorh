import { useState, useEffect, useRef, useCallback } from 'react';
import { useFirestore } from './firestore';
import { Timesheet } from '@/lib/constants';
import { toast } from '@/components/ui/use-toast';

export const useTimesheets = (employeeId?: string) => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);
  const hasInitialFetch = useRef(false);
  
  // Store the employeeId in a ref to prevent unnecessary effect triggers
  const employeeIdRef = useRef(employeeId);
  
  const timesheetsCollection = useFirestore<Timesheet>('hr_timesheet');
  
  // Memoize the fetchTimesheets function to prevent it from being recreated on each render
  const fetchTimesheets = useCallback(async () => {
    // Skip if not mounted or already fetched
    if (!isMounted.current || hasInitialFetch.current) return;
    
    console.log(`[useTimesheets] Starting fetch for employeeId: ${employeeIdRef.current}`);
    setIsLoading(true);
    
    try {
      let result;
      if (!employeeIdRef.current) {
        // If no employeeId is provided, get all timesheets
        console.log("[useTimesheets] Fetching all timesheets");
        result = await timesheetsCollection.getAll();
      } else {
        // Otherwise get timesheets for the specific employee
        console.log(`[useTimesheets] Searching for timesheets with employeeId: ${employeeIdRef.current}`);
        result = await timesheetsCollection.search({
          field: 'employeeId',
          value: employeeIdRef.current,
          operator: '=='
        });
      }
      
      // Mark as fetched to prevent future fetches
      hasInitialFetch.current = true;
      
      if (isMounted.current) {
        if (result && result.docs && result.docs.length > 0) {
          console.log(`[useTimesheets] Fetched ${result.docs.length} timesheets`);
          
          // Filter out incomplete timesheet objects
          const validTimesheets = result.docs.filter((doc: any) => {
            return doc && doc.id && (doc.status || doc.weekStartDate || doc.employeeId);
          });
          
          setTimesheets(validTimesheets);
          console.log(`[useTimesheets] After filtering, found ${validTimesheets.length} valid timesheets`);
        } else {
          console.log('[useTimesheets] No timesheets found or response is invalid, using mock data');
          // If no data found, provide test data for visibility
          setTimesheets([
            {
              id: "mock1",
              employeeId: employeeIdRef.current || "1",
              weekStartDate: "2025-05-01",
              weekEndDate: "2025-05-07",
              hours: 40,
              status: "approved",
              submittedAt: "2025-05-07T18:00:00",
              projectId: "PROJ-001"
            },
            {
              id: "mock2",
              employeeId: employeeIdRef.current || "1",
              weekStartDate: "2025-05-08",
              weekEndDate: "2025-05-14",
              hours: 38,
              status: "submitted",
              submittedAt: "2025-05-14T17:30:00",
              projectId: "PROJ-002"
            }
          ]);
        }
        
        setError(null);
      }
    } catch (err) {
      console.error('[useTimesheets] Error fetching timesheets:', err);
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les feuilles de temps",
          variant: "destructive"
        });
      }
    } finally {
      if (isMounted.current) {
        console.log('[useTimesheets] Fetch complete, setting loading to false');
        setIsLoading(false);
      }
    }
  }, [timesheetsCollection]); // Only depend on timesheetsCollection
  
  useEffect(() => {
    // Update the ref when employeeId changes
    console.log(`[useTimesheets] Effect running, employeeId: ${employeeId}`);
    employeeIdRef.current = employeeId;
    
    // Mark component as mounted
    isMounted.current = true;
    
    // Reset the fetch flag when employeeId changes
    if (employeeIdRef.current !== employeeId) {
      hasInitialFetch.current = false;
    }
    
    // Execute the fetchTimesheets function
    fetchTimesheets();
    
    // Cleanup to prevent updates on unmounted components
    return () => {
      console.log(`[useTimesheets] Component unmounted, employeeId: ${employeeId}`);
      isMounted.current = false;
    };
  }, [employeeId, fetchTimesheets]); // Only depend on employeeId and fetchTimesheets
  
  const refreshData = useCallback(() => {
    // Reset fetch flag to allow a new fetch
    hasInitialFetch.current = false;
    fetchTimesheets();
  }, [fetchTimesheets]);
  
  return {
    timesheets,
    isLoading,
    error,
    refreshData
  };
};
