
import { useCallback } from 'react';
import { useLeaveFormLabels } from './form';

export const useLeaveTypeLabels = () => {
  const { getLeaveTypeOptions } = useLeaveFormLabels();
  
  // Get leave type label based on the type ID
  const getLeaveTypeLabel = useCallback((type: string) => {
    const leaveTypes = getLeaveTypeOptions();
    const foundType = leaveTypes.find(t => t.value === type);
    return foundType ? foundType.label : 'Congé';
  }, [getLeaveTypeOptions]);
  
  return {
    getLeaveTypeLabel
  };
};
