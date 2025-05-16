
import { useState, useEffect } from 'react';
import { useFirestore } from './useFirestore';

export interface Timesheet {
  id: string;
  employeeId: string;
  project?: string;
  startDate?: string;
  endDate?: string;
  hours?: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  notes?: string;
}

export const useTimesheets = (employeeId: string) => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const timesheetsCollection = useFirestore<Timesheet>('hr_timesheets');
  
  useEffect(() => {
    const fetchTimesheets = async () => {
      setIsLoading(true);
      try {
        // Pour l'instant, retournons des données fictives
        // Dans une vraie application, cela viendrait de Firebase
        const mockTimesheets: Timesheet[] = [];
        
        // Simuler un délai pour montrer le chargement
        setTimeout(() => {
          setTimesheets(mockTimesheets);
          setIsLoading(false);
        }, 800);
        
      } catch (err) {
        console.error('Erreur lors de la récupération des feuilles de temps:', err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        setIsLoading(false);
      }
    };
    
    if (employeeId) {
      fetchTimesheets();
    } else {
      setTimesheets([]);
      setIsLoading(false);
    }
  }, [employeeId]);
  
  return {
    timesheets,
    isLoading,
    error
  };
};
