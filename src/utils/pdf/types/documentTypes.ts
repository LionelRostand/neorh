
/**
 * Types de documents pour l'application RH
 */

import { PdfTab } from '../types';

/**
 * Options pour la génération du PDF
 */
export interface PdfOptions {
  documents?: any[];
  leaves?: any[];
  evaluations?: any[];
  company?: any;
  // Autres options possibles à ajouter dans le futur
}

/**
 * Type de document
 */
export interface DocumentType {
  id: string;
  name: string;
  icon?: string;
  category?: string;
}

/**
 * Résultat d'une génération PDF
 */
export interface PdfResult {
  fileName: string;
  blob: Blob;
}

// Réexporter les types des contrats
export { ContractData, PdfResult as ContractPdfResult } from './contractTypes';
