
import { useState, useEffect } from 'react';
import { Presence, PresenceRecord, WorkSchedule } from '@/types/presence';
import { useFirestore } from './firestore';
import { format, differenceInMinutes, parseISO } from 'date-fns';

export const usePresenceData = () => {
  const [presenceRecords, setPresenceRecords] = useState<Presence[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
  
  const presenceCollection = useFirestore<PresenceRecord>('hr_presence');
  const schedulesCollection = useFirestore<WorkSchedule>('hr_work_schedules');
  
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
  
  // Charge les horaires de tous les employés
  const loadSchedules = async () => {
    try {
      const response = await schedulesCollection.getAll();
      if (response && response.docs) {
        setSchedules(response.docs);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des horaires:', err);
    }
  };
  
  // Fonction pour obtenir l'horaire prévu d'un employé pour un jour donné
  const getScheduleForDate = (employeeId: string, date: string): { start: string, end: string } | null => {
    // Convertir la date au format "dd/MM/yyyy" en objet Date
    const [day, month, year] = date.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
    
    // Chercher l'horaire correspondant
    const employeeSchedule = schedules.find(s => 
      s.employeeId === employeeId && s.dayOfWeek === dayOfWeek && s.isActive
    );
    
    return employeeSchedule 
      ? { start: employeeSchedule.startTime, end: employeeSchedule.endTime } 
      : null;
  };
  
  // Fonction pour calculer le statut basé sur l'heure d'entrée et de sortie
  const calculateStatus = (timeIn: string, timeOut: string | null, scheduledStart?: string): 'present' | 'absent' | 'late' | 'early-leave' => {
    // Si on a un horaire prévu, on compare avec celui-ci
    if (scheduledStart) {
      const [scheduledHours, scheduledMinutes] = scheduledStart.split(':').map(Number);
      const [actualHours, actualMinutes] = timeIn.split(':').map(Number);
      
      // Convertir en minutes depuis minuit pour faciliter la comparaison
      const scheduledTimeInMinutes = scheduledHours * 60 + scheduledMinutes;
      const actualTimeInMinutes = actualHours * 60 + actualMinutes;
      
      // Si l'entrée est plus de 15 minutes après l'heure prévue = retard
      if (actualTimeInMinutes > scheduledTimeInMinutes + 15) {
        return 'late';
      }
    } else {
      // Comportement par défaut si pas d'horaire prévu
      const [hours, minutes] = timeIn.split(':').map(Number);
      
      // Ex: Entrée après 9h15 = retard
      if (hours > 9 || (hours === 9 && minutes > 15)) {
        return 'late';
      }
    }
    
    // Si sortie avant l'heure prévue = départ anticipé
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
      // D'abord, charger les horaires
      await loadSchedules();
      
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
        // Obtenir l'horaire prévu pour ce jour et cet employé
        const scheduledTime = getScheduleForDate(record.employeeId, record.date);
        
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
