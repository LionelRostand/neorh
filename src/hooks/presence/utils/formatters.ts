
import { differenceInMinutes } from 'date-fns';

/**
 * Format duration between timeIn and timeOut
 */
export const formatDuration = (timeIn: string, timeOut: string | null): string | null => {
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

/**
 * Calculate status based on entry/exit times and scheduled start
 */
export const calculateStatus = (timeIn: string, timeOut: string | null, scheduledStart?: string): 'present' | 'absent' | 'late' | 'early-leave' => {
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
