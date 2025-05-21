
import { useState } from 'react';
import { useFirestore } from '@/hooks/firestore';
import { WorkSchedule } from '@/types/presence';

/**
 * Hook to load and manage employee work schedules
 */
export const useSchedules = () => {
  const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
  const schedulesCollection = useFirestore<WorkSchedule>('hr_work_schedules');

  const loadSchedules = async () => {
    try {
      const response = await schedulesCollection.getAll();
      if (response && response.docs) {
        setSchedules(response.docs);
      }
      return response?.docs || [];
    } catch (err) {
      console.error('Erreur lors de la récupération des horaires:', err);
      return [];
    }
  };

  return { schedules, loadSchedules };
};
