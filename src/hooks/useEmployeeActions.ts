
import { useState, useMemo } from 'react';
import { useEmployeeCreate } from './employee/useEmployeeCreate';
import { useEmployeeUpdate } from './employee/useEmployeeUpdate';
import { useEmployeeDelete } from './employee/useEmployeeDelete';
import { useEmployeeDataExchange } from './employee/useEmployeeDataExchange';

export const useEmployeeActions = () => {
  // Access individual action hooks
  const { createEmployee, isProcessing: isCreating } = useEmployeeCreate();
  const { updateEmployee, isProcessing: isUpdating } = useEmployeeUpdate();
  const { deleteEmployee, bulkDelete, isProcessing: isDeleting } = useEmployeeDelete();
  const { importEmployees, exportEmployees, isProcessing: isExchanging } = useEmployeeDataExchange();
  
  // Combined loading state
  const isProcessing = useMemo(() => 
    isCreating || isUpdating || isDeleting || isExchanging, 
    [isCreating, isUpdating, isDeleting, isExchanging]
  );

  return {
    // Re-export all actions
    createEmployee,
    updateEmployee,
    deleteEmployee,
    bulkDelete,
    importEmployees,
    exportEmployees,
    isProcessing
  };
};
