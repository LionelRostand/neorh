
import { Employee } from '@/types/employee';
import { MockEmployee } from '@/data/mockEmployees';

// Transform mock data to match the Employee type
export const transformEmployeesData = (rawEmployees: MockEmployee[]): Employee[] => {
  return rawEmployees.map(emp => ({
    id: emp.id,
    name: `${emp.firstName} ${emp.lastName}`,
    position: emp.position,
    department: emp.department,
    email: emp.email,
    phone: emp.phone,
    photoUrl: emp.avatarUrl,
    // Set CEO for employee with ID 4 (Marie Petit, Director HR)
    managerId: emp.id === '4' ? undefined : ['2', '4', '7', '11'].includes(emp.id) ? undefined : 
               ['1', '6', '10'].includes(emp.id) ? '2' :  // Dev team under Sophie
               ['3', '9', '12'].includes(emp.id) ? '7' :  // Marketing team under Philippe
               ['5', '8', '13'].includes(emp.id) ? '4' :   // Support/Finance under Marie
               undefined,
    startDate: emp.hireDate,
    status: emp.status === 'active' ? 'active' : 
            emp.status === 'onLeave' ? 'onLeave' : 'inactive'
  })) as Employee[];
};
