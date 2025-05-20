
import { Employee } from '@/types/employee';

/**
 * Format employee status for display in PDF
 */
export const formatEmployeeStatus = (employee: Employee): { text: string; color: string } => {
  switch (employee.status) {
    case 'active':
      return { text: 'Actif', color: '#22c55e' }; // vert plus vif
    case 'onLeave':
      return { text: 'En congé', color: '#ea580c' }; // orange plus vif
    case 'inactive':
      return { text: 'Inactif', color: '#dc2626' }; // rouge plus vif
    default:
      return { text: 'Non spécifié', color: '#4b5563' }; // gris plus contrasté
  }
};
