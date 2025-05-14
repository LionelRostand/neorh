
import { Employee } from '@/types/employee';

// Transform data to match the Employee type
export const transformEmployeesData = (rawEmployees: any[]): Employee[] => {
  if (!rawEmployees || rawEmployees.length === 0) return [];
  
  return rawEmployees.map(emp => ({
    id: emp.id || '',
    name: emp.firstName && emp.lastName ? `${emp.firstName} ${emp.lastName}` : emp.name || 'Sans nom',
    position: emp.position || '',
    department: emp.department || '',
    email: emp.email || '',
    phone: emp.phone || '',
    photoUrl: emp.avatarUrl || emp.photoUrl || '',
    managerId: emp.managerId,
    startDate: emp.hireDate || emp.startDate || '',
    status: emp.status || 'inactive'
  })) as Employee[];
};
