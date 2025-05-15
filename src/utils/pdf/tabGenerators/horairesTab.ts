
import jsPDF from 'jspdf';

/**
 * Génère la section horaires
 */
export const generateHorairesTab = (doc: jsPDF, startY: number) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Horaires', 14, startY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Aucun horaire défini pour cet employé.', 14, startY + 15);
};
