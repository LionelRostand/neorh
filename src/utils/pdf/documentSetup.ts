
import jsPDF from 'jspdf';

/**
 * Configure basic document settings like header, company info, etc.
 */
export const setupDocument = (doc: jsPDF, title: string, subtitle?: string, statusText?: string, statusColor?: string) => {
  // Définir les couleurs et styles
  const primaryColor = '#000000';
  const secondaryColor = '#666666';
  
  // Informations de l'entreprise (en-tête)
  doc.setFontSize(10);
  doc.setTextColor(secondaryColor);
  doc.text('ENTREPRISE SARL', 14, 15);
  doc.text('123 Rue des Entreprises', 14, 20);
  doc.text('75000 Paris, France', 14, 25);
  doc.text('Tel: +33 1 23 45 67 89', 14, 30);
  doc.text('Email: contact@entreprise.fr', 14, 35);
  
  // Ligne de séparation
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 40, 196, 40);
  
  // Titre du document
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text(title, 14, 50);
  
  // Status (si fourni)
  if (statusText && statusColor) {
    doc.setFontSize(12);
    doc.setTextColor(statusColor);
    doc.text(`Statut: ${statusText}`, 14, 57);
  }
  
  // Sous-titre (si fourni)
  if (subtitle) {
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(subtitle, 14, 65);
  }
  
  // Date de génération
  const today = new Date();
  doc.setFontSize(10);
  doc.setTextColor(secondaryColor);
  doc.setFont('helvetica', 'normal');
  doc.text(`Document généré le ${today.toLocaleDateString('fr-FR')}`, 14, 72);

  return doc;
};

/**
 * Add footer with page numbers to all pages
 */
export const addPageFooter = (doc: jsPDF) => {
  // Get the correct page count
  const pageCount = (doc as any).internal.pages.length - 1;
  doc.setFontSize(8);
  
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor('#666666');
    doc.text(`Page ${i} sur ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  }

  return doc;
};
