
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Training {
  id: string;
  title: string;
  description?: string;
  type?: string;
  organization?: string;
  location?: string;
  status: 'planifiée' | 'complétée' | 'annulée';
  startDate?: string;
  endDate?: string;
  employeeId?: string;
  employeeName?: string;
  participants?: number;
  trainer?: string;
  department?: string;
  employees?: string[];
}

export const useTrainingData = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const trainingsCollection = collection(db, 'hr_trainings');
    
    const unsubscribe = onSnapshot(
      trainingsCollection,
      (snapshot) => {
        const trainingsData: Training[] = [];
        snapshot.forEach((doc) => {
          trainingsData.push({
            id: doc.id,
            ...doc.data() as Omit<Training, 'id'>
          });
        });
        
        setTrainings(trainingsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching trainings:', error);
        setLoading(false);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      }
    );
    
    return () => unsubscribe();
  }, []);
  
  return { 
    trainings, 
    loading,
    error,
    refetch: () => {} // Empty function to maintain API compatibility
  };
};

export const useEmployeeTrainings = (employeeId: string) => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!employeeId) {
      setTrainings([]);
      setLoading(false);
      return;
    }
    
    const trainingsCollection = collection(db, 'hr_trainings');
    const employeeQuery = query(trainingsCollection, where('employeeId', '==', employeeId));
    
    const unsubscribe = onSnapshot(
      employeeQuery,
      (snapshot) => {
        const trainingsData: Training[] = [];
        snapshot.forEach((doc) => {
          trainingsData.push({
            id: doc.id,
            ...doc.data() as Omit<Training, 'id'>
          });
        });
        
        setTrainings(trainingsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching employee trainings:', error);
        setLoading(false);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      }
    );
    
    return () => unsubscribe();
  }, [employeeId]);
  
  return { trainings, loading, error };
};

export default useTrainingData;
