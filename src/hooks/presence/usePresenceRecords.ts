
import { useState } from 'react';
import { format } from 'date-fns';
import { useFirestore } from '@/hooks/firestore';
import { Presence, PresenceRecord } from '@/types/presence';
import { getScheduleForDate } from './utils/scheduleUtils';
import { formatDuration, calculateStatus } from './utils/formatters';

/**
 * Hook to manage presence records data
 */
export const usePresenceRecords = () => {
  const [presenceRecords, setPresenceRecords] = useState<Presence[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const presenceCollection = useFirestore<PresenceRecord>('hr_presence');
  
  // Function to process raw presence data into formatted records
  const processPresenceData = (records: PresenceRecord[], schedules: any[]) => {
    // Organize by employee and date
    const presenceMap = new Map();
    
    records.forEach(record => {
      const key = `${record.employeeId}-${record.timestamp.split('T')[0]}`;
      const time = record.timestamp.split('T')[1].substring(0, 5); // Format HH:MM
      const date = record.timestamp.split('T')[0];
      
      if (!presenceMap.has(key)) {
        presenceMap.set(key, {
          id: key,
          employeeId: record.employeeId,
          employeeName: record.employeeName || 'Employé inconnu',
          date: format(new Date(date), 'dd/MM/yyyy'),
          timeIn: record.eventType === 'entry' ? time : null,
          timeOut: record.eventType === 'exit' ? time : null,
          badgeId: record.badgeId,
          status: 'present'
        });
      } else {
        const existingRecord = presenceMap.get(key);
        if (record.eventType === 'entry' && (!existingRecord.timeIn || time < existingRecord.timeIn)) {
          existingRecord.timeIn = time;
          if (record.employeeName) {
            existingRecord.employeeName = record.employeeName;
          }
        } else if (record.eventType === 'exit' && (!existingRecord.timeOut || time > existingRecord.timeOut)) {
          existingRecord.timeOut = time;
          if (record.employeeName) {
            existingRecord.employeeName = record.employeeName;
          }
        }
      }
    });
    
    // Calculate duration and status for each record
    const formattedRecords = Array.from(presenceMap.values()).map(record => {
      // Get scheduled time for this day and employee
      const scheduledTime = getScheduleForDate(record.employeeId, record.date, schedules);
      
      const duration = record.timeIn && record.timeOut 
        ? formatDuration(record.timeIn, record.timeOut) 
        : null;
      
      const status = record.timeIn 
        ? calculateStatus(record.timeIn, record.timeOut, scheduledTime?.start)
        : 'absent';
      
      return {
        ...record,
        duration,
        status,
        scheduledStart: scheduledTime?.start,
        scheduledEnd: scheduledTime?.end
      };
    });
    
    return formattedRecords;
  };

  // Function to add a presence record
  const addPresenceRecord = async (record: Omit<PresenceRecord, 'id'>) => {
    try {
      const result = await presenceCollection.add(record);
      return !!result;
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de la présence:', err);
      setError(err instanceof Error ? err : new Error('Erreur d\'enregistrement'));
      return false;
    }
  };

  // Function to fetch all presence records
  const fetchPresenceRecords = async () => {
    try {
      const response = await presenceCollection.getAll();
      return response.docs;
    } catch (err) {
      console.error('Erreur lors de la récupération des présences:', err);
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      throw err;
    }
  };
  
  return {
    presenceRecords,
    setPresenceRecords,
    isLoading,
    setIsLoading,
    error,
    setError,
    addPresenceRecord,
    fetchPresenceRecords,
    processPresenceData
  };
};
