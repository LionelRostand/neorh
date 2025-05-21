
export interface Presence {
  id: string;
  employeeId: string;
  employeeName: string;
  badgeId?: string;
  date: string;
  timeIn: string;
  timeOut: string | null;
  duration?: string | null;
  status: 'present' | 'absent' | 'late' | 'early-leave';
  department?: string;
  scheduledStart?: string; // Heure prévue de début
  scheduledEnd?: string;   // Heure prévue de fin
}

export interface PresenceRecord {
  id: string;
  employeeId: string;
  employeeName?: string; // Added this property
  badgeId?: string;
  timestamp: string; // ISO date string
  eventType: 'entry' | 'exit';
  location?: string;
}

export interface WorkSchedule {
  id?: string;
  employeeId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string;
  endTime: string;
  isActive: boolean;
}
