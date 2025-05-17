
import jsPDF from 'jspdf';
import { Employee } from '@/types/employee';

/**
 * Génère la section évaluations
 */
export const generateEvaluationsTab = (doc: jsPDF, employee: Employee) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Évaluations', 14, 30);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Aucune évaluation disponible pour cet employé.', 14, 45);
};
