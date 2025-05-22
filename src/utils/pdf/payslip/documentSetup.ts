
import jsPDF from 'jspdf';
import { PayslipData } from './types';
import { setupDocument as baseSetupDocument, addPageFooter } from '../documentSetup';

/**
 * Configure the payslip document with headers and company information
 */
export const setupPayslipDocument = (doc: jsPDF, data: PayslipData): jsPDF => {
  // Configure document title and properties
  doc.setProperties({
    title: `Fiche de paie - ${data.employee.name}`,
    subject: `Période: ${data.period}`,
    author: data.company.name,
    creator: 'Système RH'
  });
  
  // Use the base document setup with payslip specific title
  baseSetupDocument(
    doc, 
    'Bulletin de Salaire', 
    data.employee.name, 
    undefined, 
    undefined, 
    data.company
  );
  
  return doc;
};

/**
 * Add the footer with page numbers
 */
export const finalizeDocument = (doc: jsPDF): jsPDF => {
  // Add legal notices
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Document à conserver sans limitation de durée. La présente fiche de paie ne constitue pas un document contractuel.', 14, 275);
  doc.text('Pour toute question concernant cette fiche de paie, veuillez contacter le service RH.', 14, 280);
  
  // Add the page numbers
  addPageFooter(doc);
  
  return doc;
};

/**
 * Generate the filename for the payslip PDF
 */
export const generatePayslipFilename = (employeeName: string, period: string): string => {
  return `fiche_paie_${employeeName.replace(/\s+/g, '_')}_${period.replace(/\s+/g, '_')}.pdf`;
};
