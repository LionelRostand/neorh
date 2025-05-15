
import jsPDF from 'jspdf';

/**
 * Génère la section évaluations
 */
export const generateEvaluationsTab = (doc: jsPDF, startY: number) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Évaluations', 14, startY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Aucune évaluation disponible pour cet employé.', 14, startY + 15);
};
