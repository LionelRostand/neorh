
import { useState, useEffect, useRef } from 'react';
import { useFirestore } from './useFirestore';
import { Timesheet } from '@/lib/constants';

export const useTimesheets = (employeeId?: string) => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);
  const fetchAttempted = useRef(false);
  
  const timesheetsCollection = useFirestore<Timesheet>('hr_timesheet');
  
  useEffect(() => {
    // Mark component as mounted
    isMounted.current = true;
    fetchAttempted.current = false;
    
    const fetchTimesheets = async () => {
      // Éviter de récupérer à nouveau si déjà tenté ou si démonté
      if (!isMounted.current || fetchAttempted.current) return;
      
      console.log(`Attempting to fetch timesheets for employee: ${employeeId || 'all'}`);
      fetchAttempted.current = true;
      
      try {
        let result;
        if (!employeeId) {
          // Si aucun employeeId n'est fourni, obtenir toutes les feuilles de temps
          result = await timesheetsCollection.getAll();
        } else {
          // Sinon, obtenir les feuilles de temps pour l'employé spécifique
          result = await timesheetsCollection.search('employeeId', employeeId);
        }
        
        if (isMounted.current) {
          if (result.docs && result.docs.length > 0) {
            console.log(`Fetched ${result.docs.length} timesheets for employee ${employeeId || 'all'}`);
            setTimesheets(result.docs);
          } else {
            console.log('No timesheets found in database, using mock data');
            // Si aucune donnée n'est trouvée, fournir des données fictives pour la visibilité
            const mockData: Timesheet[] = [
              {
                id: "mock1",
                employeeId: employeeId || "unknown",
                weekStartDate: "2025-05-01",
                weekEndDate: "2025-05-07",
                hours: 40,
                status: "approved",
                submittedAt: "2025-05-07T18:00:00",
                projectId: "PROJ-001"
              },
              {
                id: "mock2",
                employeeId: employeeId || "unknown",
                weekStartDate: "2025-05-08",
                weekEndDate: "2025-05-14",
                hours: 38,
                status: "submitted",
                submittedAt: "2025-05-14T17:30:00",
                projectId: "PROJ-002"
              }
            ];
            setTimesheets(mockData);
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
    
    // Cleanup pour éviter les mises à jour sur les composants démontés
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
