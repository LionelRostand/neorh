
import { useState, useEffect } from 'react';
import { useFirestore } from './firestore';
import { Timesheet } from '@/lib/constants';
import { SearchOptions } from './firestore/searchOperations';
import { showErrorToast } from '@/utils/toastUtils';

export const useTimesheets = (employeeId: string) => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { search } = useFirestore<Timesheet>('hr_timesheet');
  
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
        // Essayer la recherche avec un tri plus simple d'abord
        const searchOptions: SearchOptions = {
          // Ne pas utiliser de tri pour éviter les erreurs d'index dans un premier temps
        };
        
        const result = await search('employeeId', employeeId, searchOptions);
        console.log('Timesheet search results:', result);
        
        if (result.docs && result.docs.length > 0) {
          // Trier côté client si nécessaire
          const sortedDocs = [...result.docs].sort((a, b) => {
            if (a.weekStartDate && b.weekStartDate) {
              return new Date(b.weekStartDate).getTime() - new Date(a.weekStartDate).getTime();
            }
            return 0;
          });
          setTimesheets(sortedDocs);
        } else {
          setTimesheets([]);
        }
      } catch (err) {
        console.error('Error fetching timesheets:', err);
        const fetchError = err instanceof Error ? err : new Error('Failed to fetch timesheets');
        
        // Vérifier si l'erreur concerne un index manquant
        const errorMessage = fetchError.message || '';
        const isIndexError = errorMessage.includes('index') || errorMessage.includes('composite');
        
        if (isIndexError) {
          console.warn('Firebase index error detected, loading mock data');
          showErrorToast(`Erreur d'index Firebase. Chargement des données temporaires.`);
        } else {
          setError(fetchError);
          showErrorToast(`Error loading timesheets: ${fetchError.message}`);
        }
        
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
