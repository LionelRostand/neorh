
import { useState, useEffect } from 'react';
import { useFirestore } from './firestore';
import { Timesheet } from '@/lib/constants';

export const useTimesheets = (employeeId: string) => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { search } = useFirestore<Timesheet>('hr_timesheet'); // Corriger le nom de la collection
  
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
        const result = await search('employeeId', employeeId);
        console.log('Timesheet search results:', result);
        setTimesheets(result.docs);
      } catch (err) {
        console.error('Error fetching timesheets:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch timesheets'));
        
        // En cas d'erreur, charger des données fictives pour le développement
        console.log('Loading mock data due to error');
        setTimesheets([
          {
            id: "1",
            employeeId: employeeId,
            weekStartDate: "2025-05-10",
            weekEndDate: "2025-05-16",
            hours: 40,
            status: "approved",
            submittedAt: "2025-05-16T18:00:00",
            dailyEntries: [
              { date: "2025-05-10", hours: 1, projectId: "PROJ-001", notes: "Développement" },
              { date: "2025-05-11", hours: 0.5, projectId: "PROJ-002", notes: "Tests" },
              { date: "2025-05-12", hours: 1, projectId: "PROJ-001", notes: "Réunion" }
            ]
          },
          {
            id: "2",
            employeeId: employeeId,
            weekStartDate: "2025-05-03", 
            weekEndDate: "2025-05-09",
            hours: 35,
            status: "submitted",
            submittedAt: "2025-05-09T17:00:00"
          }
        ]);
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
