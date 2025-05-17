
import jsPDF from 'jspdf';
import { Document } from '@/lib/constants';
import autoTable from 'jspdf-autotable';
import { Employee } from '@/types/employee';

/**
 * Génère la section documents
 */
export const generateDocumentsTab = async (doc: jsPDF, employee: Employee) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Documents', 14, 30);
  
  // Since we don't have actual documents data here, we're showing a placeholder
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Aucun document disponible pour cet employé.', 14, 45);
  
  // Empty table for demonstration purposes
  autoTable(doc, {
    startY: 55,
    head: [
      ['Titre', 'Catégorie', 'Type', 'Date', 'Statut']
    ],
    body: [],
    theme: 'grid',
    styles: {
      fontSize: 8
    },
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    }
  });
};
