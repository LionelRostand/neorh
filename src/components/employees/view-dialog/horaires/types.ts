
import { Employee } from '@/types/employee';

export interface WorkSchedule {
  id?: string;
  employeeId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export const daysOfWeek: Record<number, string> = {
  0: "Dimanche",
  1: "Lundi",
  2: "Mardi",
  3: "Mercredi",
  4: "Jeudi",
  5: "Vendredi",
  6: "Samedi"
};

export interface EmployeeHorairesProps {
  employee: Employee;
  onRefresh?: () => void;
}
