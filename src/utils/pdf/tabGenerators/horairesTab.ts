
import jsPDF from 'jspdf';
import { Employee } from '@/types/employee';

/**
 * Génère la section horaires
 */
export const generateHorairesTab = (doc: jsPDF, employee: Employee) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Horaires', 14, 30);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Aucun horaire défini pour cet employé.', 14, 45);
};
