
import jsPDF from 'jspdf';
import { Employee } from '@/types/employee';
import { Company } from '@/types/company';
import { setupDocument, addPageFooter } from './documentSetup';
import { formatEmployeeStatus } from './statusFormatter';
import { 
  generateInformationsTab,
  generateDocumentsTab,
  generateCompetencesTab,
  generateHorairesTab,
  generateCongesTab,
  generateEvaluationsTab
} from './tabGenerators';
import type { PdfTab } from './types';
import type { Evaluation } from '@/hooks/useEmployeeEvaluations';

/**
 * Options pour la génération du PDF
 */
export interface PdfOptions {
  documents?: any[];
  leaves?: any[];
  evaluations?: Evaluation[];
  company?: Company;
  // Autres options possibles à ajouter dans le futur
}

/**
 * Génère un PDF pour les informations de l'employé
 */
export const generateEmployeePdf = (employee: Employee, activeTab: string, options?: PdfOptions) => {
  // Initialisation du document PDF
  const doc = new jsPDF();
  
  // Améliorer la qualité et la lisibilité du PDF
  doc.setProperties({
    title: `Fiche Employé - ${employee.name || 'Sans nom'}`,
    subject: 'Informations employé',
    author: 'Système RH',
    creator: 'Application RH'
  });
  
  // Format employee status
  const status = formatEmployeeStatus(employee);
  
  // Configure le document avec les informations de base
  setupDocument(
    doc, 
    'Fiche Employé', 
    employee.name || 'Sans nom', 
    status.text, 
    status.color, 
    options?.company
  );
  
  // Contenu en fonction de l'onglet actif
  switch (activeTab as PdfTab) {
    case 'informations':
      generateInformationsTab(doc, employee);
      break;
    case 'documents':
      generateDocumentsTab(doc, employee);
      break;
    case 'competences':
      generateCompetencesTab(doc, employee);
      break;
    case 'horaires':
      generateHorairesTab(doc, employee);
      break;
    case 'conges':
      generateCongesTab(doc, employee);
      break;
    case 'evaluations':
      generateEvaluationsTab(doc, employee);
      break;
    default:
      generateInformationsTab(doc, employee);
  }
  
  // Ajoute les numéros de page
  addPageFooter(doc);
  
  // Enregistrer le PDF
  const fileName = `employee_${employee.id}_${activeTab}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};

export * from './types';
