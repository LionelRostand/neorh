
import { useState, useEffect, useRef } from 'react';
import { useFirestore } from './firestore';

export interface Training {
  id: string;
  title: string;
  description: string;
  trainer: string;
  department: string;
  participants: number;
  status: "planifiée" | "complétée" | "annulée";
  employeeId?: string;
  employeeName?: string; 
  type?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
}

export const useTrainingData = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { getAll } = useFirestore<Training>('hr_trainings');
  const fetchedRef = useRef(false);
  
  useEffect(() => {
    const fetchTrainings = async () => {
      if (fetchedRef.current) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching all trainings from hr_trainings');
        const result = await getAll();
        
        if (result.docs) {
          console.log(`Found ${result.docs.length} trainings`);
          setTrainings(result.docs);
        } else {
          console.log('No trainings found or empty result');
          setTrainings([]);
        }
        
        fetchedRef.current = true;
      } catch (err) {
        console.error("Error fetching trainings:", err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        fetchedRef.current = true;
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrainings();
  }, [getAll]);
  
  return {
    trainings,
    loading,
    error,
    refetch: () => {
      fetchedRef.current = false;
      setTrainings([]);
    }
  };
};

export const useEmployeeTrainings = (employeeId: string) => {
  const [employeeTrainings, setEmployeeTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { search } = useFirestore<Training>('hr_trainings');
  const fetchedRef = useRef(false);
  
  useEffect(() => {
    // Ne pas exécuter la recherche si l'employeeId est vide
    if (!employeeId) {
      setLoading(false);
      setEmployeeTrainings([]);
      return;
    }
    
    // N'exécuter la requête qu'une seule fois par employeeId
    if (fetchedRef.current) {
      return;
    }
    
    const fetchEmployeeTrainings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching trainings for employee ID: ${employeeId}`);
        
        const result = await search({
          field: 'employeeId',
          value: employeeId
        });
        
        if (result.docs) {
          console.log(`Found ${result.docs.length} trainings for employee`);
          setEmployeeTrainings(result.docs);
        } else {
          console.log('No trainings found for this employee');
          setEmployeeTrainings([]);
        }
        
        fetchedRef.current = true;
      } catch (err) {
        console.error("Error fetching employee trainings:", err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        fetchedRef.current = true;
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeTrainings();
  }, [employeeId, search]);

  return {
    trainings: employeeTrainings,
    loading,
    error
  };
};
