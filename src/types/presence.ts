
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
}

export interface PresenceRecord {
  id: string;
  employeeId: string;
  badgeId?: string;
  timestamp: string; // ISO date string
  eventType: 'entry' | 'exit';
  location?: string;
}
