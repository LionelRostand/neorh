
import { useState, useEffect } from 'react';
import { Presence, PresenceRecord } from '@/types/presence';
import { useFirestore } from './firestore';
import { format, differenceInMinutes } from 'date-fns';

export const usePresenceData = () => {
  const [presenceRecords, setPresenceRecords] = useState<Presence[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const presenceCollection = useFirestore<PresenceRecord>('hr_presence');
  
  // Fonction pour formater la durée entre entrée et sortie
  const formatDuration = (timeIn: string, timeOut: string | null): string | null => {
    if (!timeOut) return null;
    
    const [hoursIn, minutesIn] = timeIn.split(':').map(Number);
    const [hoursOut, minutesOut] = timeOut.split(':').map(Number);
    
    const dateIn = new Date();
    dateIn.setHours(hoursIn, minutesIn, 0);
    
    const dateOut = new Date();
    dateOut.setHours(hoursOut, minutesOut, 0);
    
    // Si la sortie est le lendemain
    if (dateOut < dateIn) {
      dateOut.setDate(dateOut.getDate() + 1);
    }
    
    const diffMinutes = differenceInMinutes(dateOut, dateIn);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    return `${hours}h${minutes.toString().padStart(2, '0')}`;
  };
  
  // Fonction pour calculer le statut basé sur l'heure d'entrée et de sortie
  const calculateStatus = (timeIn: string, timeOut: string | null): 'present' | 'absent' | 'late' | 'early-leave' => {
    const [hours, minutes] = timeIn.split(':').map(Number);
    
    // Ex: Entrée après 9h15 = retard
    if (hours > 9 || (hours === 9 && minutes > 15)) {
      return 'late';
    }
    
    // Si sortie avant 17h = départ anticipé
    if (timeOut) {
      const [hoursOut, minutesOut] = timeOut.split(':').map(Number);
      if (hoursOut < 17) {
        return 'early-leave';
      }
    }
    
    return 'present';
  };
  
  // Récupérer et organiser les données de présence
  const fetchPresenceData = async () => {
    setIsLoading(true);
    try {
      // Récupérer toutes les entrées/sorties
      const response = await presenceCollection.getAll();
      const records = response.docs;
      
      // Organiser par employé et par date
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
      
      // Calculer la durée et le statut pour chaque enregistrement
      const formattedRecords = Array.from(presenceMap.values()).map(record => {
        const duration = record.timeIn && record.timeOut 
          ? formatDuration(record.timeIn, record.timeOut) 
          : null;
        
        const status = record.timeIn 
          ? calculateStatus(record.timeIn, record.timeOut)
          : 'absent';
        
        return {
          ...record,
          duration,
          status
        };
      });
      
      setPresenceRecords(formattedRecords);
    } catch (err) {
      console.error('Erreur lors de la récupération des présences:', err);
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPresenceData();
  }, []);
  
  // Fonction pour ajouter un nouvel enregistrement
  const addPresenceRecord = async (record: Omit<PresenceRecord, 'id'>) => {
    try {
      const result = await presenceCollection.add(record);
      if (result) {
        await fetchPresenceData(); // Rafraîchir les données
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de la présence:', err);
      setError(err instanceof Error ? err : new Error('Erreur d\'enregistrement'));
      return false;
    }
  };
  
  return {
    presenceRecords,
    isLoading,
    error,
    addPresenceRecord,
    refreshData: fetchPresenceData
  };
};
