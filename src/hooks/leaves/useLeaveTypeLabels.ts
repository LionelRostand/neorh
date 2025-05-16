
import { useState, useCallback } from 'react';
import { leaveTypes } from '@/components/leaves/form/LeaveTypeField';

export const useLeaveTypeLabels = () => {
  // Mémoriser les étiquettes pour éviter des créations inutiles
  const getLeaveTypeLabel = useCallback((type: string) => {
    const foundType = leaveTypes.find(t => t.id === type);
    return foundType ? foundType.label : 'Congé';
  }, []);
  
  return {
    getLeaveTypeLabel
  };
};
