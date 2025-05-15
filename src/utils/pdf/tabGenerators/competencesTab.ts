
import jsPDF from 'jspdf';

/**
 * Génère la section compétences
 */
export const generateCompetencesTab = (doc: jsPDF, startY: number) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Compétences', 14, startY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Aucune compétence enregistrée pour cet employé.', 14, startY + 15);
};
