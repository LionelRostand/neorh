
import { Presence, PresenceRecord, WorkSchedule } from '@/types/presence';

export interface PresenceState {
  presenceRecords: Presence[];
  isLoading: boolean;
  error: Error | null;
}

export interface PresenceDataResult extends PresenceState {
  addPresenceRecord: (record: Omit<PresenceRecord, 'id'>) => Promise<boolean>;
  refreshData: () => Promise<void>;
}
