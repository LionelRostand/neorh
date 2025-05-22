
import { Document } from '@/lib/constants';

/**
 * Interface définissant la structure des données d'un contrat
 */
export interface ContractData {
  id: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  departmentId: string;
  position: string;
  type: string;
  startDate: Date;
  endDate?: Date;
  salary: string;
  status: 'draft' | 'pending_signature' | 'active' | 'signed' | 'expired';
  signedByEmployee: boolean;
  signedByEmployer: boolean;
  conventionCollective?: string;
  additionalClauses?: string;
  employeeSignatureDate?: string;
  employerSignatureDate?: string;
}

/**
 * Résultat de la génération PDF
 */
export interface PdfResult {
  fileName: string;
  pdfData: Blob;
  pdfBase64: string;
}

/**
 * Types de contrats disponibles
 */
export type ContractType = 'CDI' | 'CDD' | 'Interim' | 'Stage' | 'Apprentissage' | 'Freelance';

