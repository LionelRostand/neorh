
import { useState, useEffect, useRef } from 'react';
import { useFirestore } from './useFirestore';
import { Timesheet } from '@/lib/constants';

export const useTimesheets = (employeeId?: string) => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);
  
  // Store the employeeId in a ref to prevent unnecessary effect triggers
  const employeeIdRef = useRef(employeeId);
  const fetchAttempted = useRef(false);
  
  const timesheetsCollection = useFirestore<Timesheet>('hr_timesheet');
  
  useEffect(() => {
    // Update the ref when employeeId changes
    employeeIdRef.current = employeeId;
    
    // Mark component as mounted and reset fetch flag
    isMounted.current = true;
    fetchAttempted.current = false;
    
    const fetchTimesheets = async () => {
      // Skip if already fetched or unmounted
      if (!isMounted.current || fetchAttempted.current) return;
      
      fetchAttempted.current = true;
      setIsLoading(true);
      
      try {
        let result;
        if (!employeeIdRef.current) {
          // If no employeeId is provided, get all timesheets
          result = await timesheetsCollection.getAll();
        } else {
          // Otherwise get timesheets for the specific employee
          result = await timesheetsCollection.search('employeeId', employeeIdRef.current);
        }
        
        if (isMounted.current) {
          if (result.docs && result.docs.length > 0) {
            setTimesheets(result.docs);
            console.log(`Fetched ${result.docs.length} timesheets for ${employeeIdRef.current ? `employee ${employeeIdRef.current}` : 'all employees'}`);
          } else {
            console.log('No timesheets found, using mock data');
            // If no data is found, provide mock data for visibility
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
        }
      } catch (err) {
        console.error('Error fetching timesheets:', err);
        if (isMounted.current) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };
    
    fetchTimesheets();
    
    // Cleanup to prevent updates on unmounted components
    return () => {
      isMounted.current = false;
    };
  }, [employeeId, timesheetsCollection]);
  
  return {
    timesheets,
    isLoading,
    error
  };
};
