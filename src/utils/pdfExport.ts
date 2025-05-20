
import JsPDF from 'jspdf';
import { Employee } from '@/types/employee';
import { Company } from '@/types/company';
import { setupDocument, addPageFooter } from './pdf/documentSetup';
import { formatEmployeeStatus } from './pdf/statusFormatter';
import {
  generateInformationsTab,
  generateDocumentsTab,
  generateCompetencesTab,
  generateHorairesTab,
  generateCongesTab,
  generateFeuillesDeTempsTab,
  generateEvaluationsTab
} from './pdf/tabGenerators';

interface PdfOptions {
  documents?: any[];
  leaves?: any[];
  evaluations?: any[];
  company?: Company;
}

export const generateEmployeePdfWithDocuments = async (
  employee: Employee, 
  activeTab: string, 
  options?: PdfOptions
) => {
  const doc = new JsPDF();
  
  // Améliorer la qualité et la lisibilité du PDF
  doc.setProperties({
    title: `Fiche Employé - ${employee.name || 'Sans nom'}`,
    subject: 'Informations employé',
    author: 'Système RH',
    creator: 'Application RH'
  });
  
  // Format employee status
  const status = formatEmployeeStatus(employee);
  
  // Configure document with basic information
  setupDocument(
    doc, 
    'Fiche Employé', 
    employee.name || 'Sans nom', 
    status.text, 
    status.color,
    options?.company
  );

  switch (activeTab) {
    case 'informations':
      generateInformationsTab(doc, employee);
      break;
    case 'documents':
      await generateDocumentsTab(doc, employee);
      break;
    case 'competences':
      generateCompetencesTab(doc, employee);
      break;
    case 'horaires':
      generateHorairesTab(doc, employee);
      break;
    case 'feuillesdetemps':
      generateFeuillesDeTempsTab(doc, employee);
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
  
  // Add page numbers
  addPageFooter(doc);
  
  // Save the PDF
  const fileName = `${employee.name.replace(/\s+/g, '_')}_fiche.pdf`;
  doc.save(fileName);

  return fileName;
};
