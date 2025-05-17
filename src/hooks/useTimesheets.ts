
import { useState, useEffect } from 'react';
import { useFirestore } from './useFirestore';

export interface Timesheet {
  id: string;
  employeeId: string;
  project?: string;
  projectId?: string;
  startDate?: string;
  endDate?: string;
  hours?: number;
  weekStartDate?: string;
  weekEndDate?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  notes?: string;
}

export const useTimesheets = (employeeId?: string) => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const timesheetsCollection = useFirestore<Timesheet>('hr_timesheet');
  
  useEffect(() => {
    const fetchTimesheets = async () => {
      if (!employeeId) {
        // Si aucun employeeId n'est fourni, récupérer toutes les feuilles de temps
        setIsLoading(true);
        try {
          const result = await timesheetsCollection.getAll();
          setTimesheets(result.docs);
        } catch (err) {
          console.error('Erreur lors de la récupération des feuilles de temps:', err);
          setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // Sinon récupérer les feuilles de temps pour l'employé spécifié
      setIsLoading(true);
      try {
        const result = await timesheetsCollection.search('employeeId', employeeId);
        setTimesheets(result.docs);
        console.log(`Fetched ${result.docs.length} timesheets for employee ${employeeId}`);
      } catch (err) {
        console.error('Erreur lors de la récupération des feuilles de temps:', err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTimesheets();
  }, [employeeId, timesheetsCollection]);
  
  return {
    timesheets,
    isLoading,
    error
  };
};
