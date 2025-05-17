import { useState, useEffect, useRef } from 'react';
import { useFirestore } from './useFirestore';
import { Timesheet } from '@/lib/constants';

export const useTimesheets = (employeeId?: string) => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);
  
  // Store the employeeId in a ref to prevent unnecessary effect triggers
  const employeeIdRef = useRef(employeeId);
  
  const timesheetsCollection = useFirestore<Timesheet>('hr_timesheet');
  
  useEffect(() => {
    // Update the ref when employeeId changes
    employeeIdRef.current = employeeId;
    
    // Mark component as mounted
    isMounted.current = true;
    
    const fetchTimesheets = async () => {
      // Skip fetching if already loading to prevent duplicate requests
      if (!isMounted.current) return;
      
      setIsLoading(true);
      
      try {
        if (!employeeIdRef.current) {
          // If no employeeId is provided, get all timesheets
          const result = await timesheetsCollection.getAll();
          if (isMounted.current) {
            setTimesheets(result.docs);
            console.log(`Fetched ${result.docs.length} timesheets`);
          }
        } else {
          // Otherwise get timesheets for the specific employee
          const result = await timesheetsCollection.search('employeeId', employeeIdRef.current);
          if (isMounted.current) {
            setTimesheets(result.docs);
            console.log(`Fetched ${result.docs.length} timesheets for employee ${employeeIdRef.current}`);
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
