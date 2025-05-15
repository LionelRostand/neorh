
import { Employee } from '@/types/employee';

/**
 * Format employee status for display in PDF
 */
export const formatEmployeeStatus = (employee: Employee): { text: string; color: string } => {
  switch (employee.status) {
    case 'active':
      return { text: 'Actif', color: '#22c55e' }; // green
    case 'onLeave':
      return { text: 'En congé', color: '#f59e0b' }; // amber
    case 'inactive':
      return { text: 'Inactif', color: '#ef4444' }; // red
    default:
      return { text: 'Indéfini', color: '#6b7280' }; // gray
  }
};
