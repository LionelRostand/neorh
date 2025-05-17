
import { useState, useEffect } from 'react';
import { useFirestore } from './firestore';
import { Timesheet } from '@/lib/constants';

export const useTimesheets = (employeeId: string) => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { search } = useFirestore<Timesheet>('hr_timesheets');
  
  useEffect(() => {
    if (!employeeId) {
      setIsLoading(false);
      return;
    }
    
    const fetchTimesheets = async () => {
      setIsLoading(true);
      setError(null);
      console.log(`Attempting to fetch timesheets for employee: ${employeeId}`);
      
      try {
        const result = await search('employeeId', employeeId, {
          orderByField: 'weekStartDate',
          orderDirection: 'desc'
        });
        
        setTimesheets(result.docs);
      } catch (err) {
        console.error('Error fetching timesheets:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch timesheets'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTimesheets();
  }, [employeeId, search]);
  
  return {
    timesheets,
    isLoading,
    error
  };
};
