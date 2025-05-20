
import jsPDF from 'jspdf';
import { Company } from '@/types/company';

/**
 * Sets up the header content of the contract document
 */
export const setupContractHeader = (
  doc: jsPDF, 
  company?: Company,
  margin: number = 20
): number => {
  let yPosition = margin;
  
  // Nom de l'entreprise à gauche
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(company?.name || 'ENTREPRISE', margin, yPosition);
  
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  if (company?.address) {
    doc.text(company.address, margin, yPosition);
    yPosition += 5;
  }
  
  const locationParts = [];
  if (company?.postalCode) locationParts.push(company.postalCode);
  if (company?.city) locationParts.push(company.city);
  if (locationParts.length > 0) {
    doc.text(locationParts.join(' '), margin, yPosition);
    yPosition += 5;
  }
  
  if (company?.phone) {
    doc.text(`Tél: ${company.phone}`, margin, yPosition);
    yPosition += 5;
  }
  
  if (company?.email) {
    doc.text(`Email: ${company.email}`, margin, yPosition);
    yPosition += 5;
  }
  
  // Logo de l'entreprise à droite
  if (company?.logoUrl) {
    try {
      doc.addImage(
        company.logoUrl,
        'JPEG',
        doc.internal.pageSize.width - 60,
        margin,
        40,
        25
      );
    } catch (err) {
      console.error("Erreur lors de l'ajout du logo:", err);
    }
  } else if (company?.logo?.base64) {
    try {
      doc.addImage(
        company.logo.base64,
        'JPEG',
        doc.internal.pageSize.width - 60,
        margin,
        40,
        25
      );
    } catch (err) {
      console.error("Erreur lors de l'ajout du logo:", err);
    }
  }
  
  return yPosition;
};
