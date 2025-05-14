
import { MockEmployee } from '@/data/mockEmployees';

// Calculate department statistics
export const calculateDepartmentStats = (employees: MockEmployee[]): Record<string, number> => {
  if (!employees.length) return {};
  
  return employees.reduce((acc, employee) => {
    const dept = employee.department;
    if (!acc[dept]) acc[dept] = 0;
    acc[dept]++;
    return acc;
  }, {} as Record<string, number>);
};

// Calculate status statistics
export const calculateStatusStats = (employees: MockEmployee[]): Record<string, number> => {
  if (!employees.length) return {};
  
  return employees.reduce((acc, employee) => {
    const status = employee.status;
    if (!acc[status]) acc[status] = 0;
    acc[status]++;
    return acc;
  }, {} as Record<string, number>);
};
