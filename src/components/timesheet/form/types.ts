
import { Timesheet } from '@/lib/constants';

export interface TimesheetFormValues {
  dailyHours: Record<string, {
    hours: number;
    projectId: string;
    notes: string;
  }>;
  notes: string;
}

export interface TimesheetDetailFormProps {
  timesheet: Timesheet;
  onClose: () => void;
}
