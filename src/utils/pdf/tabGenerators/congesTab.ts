
import jsPDF from 'jspdf';

/**
 * Génère la section congés
 */
export const generateCongesTab = (doc: jsPDF, startY: number) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Congés', 14, startY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Aucun congé enregistré pour cet employé.', 14, startY + 15);
};
