
import { Employee } from '@/types/employee';
import { Document } from '@/lib/constants';

export type PdfTab = 'informations' | 'documents' | 'competences' | 'horaires' | 'conges' | 'evaluations';

export interface PdfExportData {
  employee: Employee;
  documents?: Document[];
  // Autres données qui pourraient être nécessaires pour d'autres onglets
}
