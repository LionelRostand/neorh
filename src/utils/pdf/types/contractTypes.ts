
import { Document } from '@/lib/constants';

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
  status: 'draft' | 'pending_signature' | 'active' | 'signed';
  signedByEmployee: boolean;
  signedByEmployer: boolean;
  conventionCollective?: string;
  additionalClauses?: string;
}

export interface PdfResult {
  fileName: string;
  pdfData: Blob;
  pdfBase64: string;
}

export type ContractType = 'CDI' | 'CDD' | 'Interim' | 'Stage' | 'Apprentissage' | 'Freelance';
