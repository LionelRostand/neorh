
import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
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
}

export const useTrainingData = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  
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
      }
    );
    
    return () => unsubscribe();
  }, []);
  
  return { trainings, loading };
};

export default useTrainingData;
