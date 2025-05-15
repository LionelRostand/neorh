
import jsPDF from 'jspdf';

/**
 * Génère la section documents
 */
export const generateDocumentsTab = (doc: jsPDF, startY: number) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Documents', 14, startY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Aucun document disponible pour cet employé.', 14, startY + 15);
};
