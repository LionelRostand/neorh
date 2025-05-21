
import { Employee } from "@/types/employee";

export interface WorkSchedule {
  id?: string;
  employeeId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface EmployeeHorairesProps {
  employee: Employee;
  onRefresh?: () => void;
}

export const daysOfWeek = [
  "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"
];
