
import { useMemo } from 'react';
import { Employee } from '@/types/employee';

export const useEmployeeStatusStats = (employees: Employee[] | undefined = []) => {
  const stats = useMemo(() => {
    const totalEmployees = employees?.length || 0;
    const activeEmployees = employees?.filter(emp => emp.status === 'active')?.length || 0;
    const onLeaveEmployees = employees?.filter(emp => emp.status === 'onLeave')?.length || 0;
    const inactiveEmployees = employees?.filter(emp => emp.status === 'inactive')?.length || 0;

    return {
      totalEmployees,
      activeEmployees,
      onLeaveEmployees,
      inactiveEmployees
    };
  }, [employees]);

  return stats;
};
