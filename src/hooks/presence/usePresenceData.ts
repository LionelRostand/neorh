
import { useEffect } from 'react';
import { useSchedules } from './useSchedules';
import { usePresenceRecords } from './usePresenceRecords';
import { PresenceDataResult } from './types';

/**
 * Main hook for presence data management
 */
export const usePresenceData = (): PresenceDataResult => {
  const { loadSchedules } = useSchedules();
  const {
    presenceRecords,
    setPresenceRecords,
    isLoading,
    setIsLoading,
    error,
    setError,
    addPresenceRecord,
    fetchPresenceRecords,
    processPresenceData
  } = usePresenceRecords();

  // Fetch presence data on component mount
  const fetchPresenceData = async () => {
    setIsLoading(true);
    try {
      // First, load all schedules
      const schedules = await loadSchedules();
      
      // Then fetch all presence records
      const records = await fetchPresenceRecords();
      
      // Process the data
      const formattedRecords = processPresenceData(records, schedules);
      
      // Update state
      setPresenceRecords(formattedRecords);
    } catch (err) {
      console.error('Error fetching presence data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPresenceData();
  }, []);
  
  return {
    presenceRecords,
    isLoading,
    error,
    addPresenceRecord: async (record) => {
      const result = await addPresenceRecord(record);
      if (result) {
        await fetchPresenceData();
      }
      return result;
    },
    refreshData: fetchPresenceData
  };
};
