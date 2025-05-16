
export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  departmentId?: string; // Added to keep reference to the original department ID
  email: string;
  phone?: string;
  photoUrl?: string;
  managerId?: string;
  startDate: string;
  status: 'active' | 'inactive' | 'onLeave';
  // Ajout de nouveaux champs optionnels pour plus d'informations
  professionalEmail?: string;
  personalEmail?: string;
  birthDate?: string;
  address?: string;
}
