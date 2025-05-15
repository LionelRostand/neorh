
import jsPDF from 'jspdf';
import { Document } from '@/lib/constants';
import autoTable from 'jspdf-autotable';

/**
 * Génère la section documents
 */
export const generateDocumentsTab = (doc: jsPDF, startY: number, documents?: Document[]) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Documents', 14, startY);
  
  if (!documents || documents.length === 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Aucun document disponible pour cet employé.', 14, startY + 15);
    return;
  }
  
  // Structure des données pour le tableau
  const tableData = documents.map(doc => [
    doc.title || 'Sans titre',
    doc.category || 'Non catégorisé',
    doc.fileType || 'Inconnu',
    doc.uploadDate || 'Date inconnue',
    doc.status || 'N/A'
  ]);
  
  // En-têtes du tableau
  const headers = [
    { header: 'Titre', dataKey: 'title' },
    { header: 'Catégorie', dataKey: 'category' },
    { header: 'Type', dataKey: 'type' },
    { header: 'Date', dataKey: 'date' },
    { header: 'Statut', dataKey: 'status' }
  ];
  
  // Génération du tableau
  autoTable(doc, {
    startY: startY + 10,
    head: [headers.map(h => h.header)],
    body: tableData,
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
