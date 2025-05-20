
import jsPDF from 'jspdf';
import { Company } from '@/types/company';

/**
 * Adds parties information
 */
export const addPartiesSection = (
  doc: jsPDF, 
  employeeName: string,
  company?: Company,
  margin: number = 20,
  startY: number = 100
): number => {
  let yPosition = startY;
  
  doc.text('ENTRE LES SOUSSIGNÉS :', margin, yPosition);
  yPosition += 10;
  
  doc.text(`La société ${company?.name || 'ENTREPRISE'}, ${company?.type || ''} ${company?.industry ? `dans le secteur ${company.industry}` : ''}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Siège social : ${company?.address || ''}, ${company?.postalCode || ''} ${company?.city || ''}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Représentée par son dirigeant légal,`, margin, yPosition);
  yPosition += 7;
  doc.text(`Ci-après dénommée "L'EMPLOYEUR"`, margin, yPosition);
  
  yPosition += 12;
  doc.text(`ET`, margin, yPosition);
  
  yPosition += 12;
  doc.text(`${employeeName}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Ci-après dénommé(e) "LE SALARIÉ"`, margin, yPosition);
  
  yPosition += 12;
  doc.text(`IL A ÉTÉ CONVENU CE QUI SUIT :`, margin, yPosition);
  
  return yPosition + 15;
};
