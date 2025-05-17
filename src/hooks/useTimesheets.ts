
import { useState, useEffect, useRef } from 'react';
import { useFirestore } from './useFirestore';
import { Timesheet } from '@/lib/constants';

export const useTimesheets = (employeeId?: string) => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);
  
  const timesheetsCollection = useFirestore<Timesheet>('hr_timesheet');
  
  useEffect(() => {
    // Référence pour éviter les mises à jour sur un composant démonté
    isMounted.current = true;
    
    const fetchTimesheets = async () => {
      setIsLoading(true);
      
      try {
        if (!employeeId) {
          // Si aucun employeeId n'est fourni, récupérer toutes les feuilles de temps
          const result = await timesheetsCollection.getAll();
          if (isMounted.current) {
            setTimesheets(result.docs);
            console.log(`Fetched ${result.docs.length} timesheets`);
          }
        } else {
          // Sinon récupérer les feuilles de temps pour l'employé spécifié
          const result = await timesheetsCollection.search('employeeId', employeeId);
          if (isMounted.current) {
            setTimesheets(result.docs);
            console.log(`Fetched ${result.docs.length} timesheets for employee ${employeeId}`);
          }
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des feuilles de temps:', err);
        if (isMounted.current) {
          setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };
    
    fetchTimesheets();
    
    // Nettoyage pour éviter les mises à jour sur des composants démontés
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
