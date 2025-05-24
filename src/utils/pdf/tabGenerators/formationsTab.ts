
import jsPDF from 'jspdf';
import { Employee } from '@/types/employee';

/**
 * Génère la section formations
 */
export const generateFormationsTab = (doc: jsPDF, employee: Employee) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Formations', 14, 30);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Aucune formation enregistrée pour cet employé.', 14, 45);
};
