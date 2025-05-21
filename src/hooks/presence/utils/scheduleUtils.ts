
import { format } from 'date-fns';
import { WorkSchedule } from '@/types/presence';

/**
 * Get scheduled work hours for an employee on a specific date
 */
export const getScheduleForDate = (
  employeeId: string, 
  date: string, 
  schedules: WorkSchedule[]
): { start: string, end: string } | null => {
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
