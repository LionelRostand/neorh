
import jsPDF from 'jspdf';
import { Document } from '@/lib/constants';
import autoTable from 'jspdf-autotable';
import { Employee } from '@/types/employee';
import { getCategoryLabel } from '@/utils/documents/documentUtils';

/**
 * Génère la section documents
 */
export const generateDocumentsTab = async (doc: jsPDF, employee: Employee, documents: Document[] = []) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Documents', 14, 30);
  
  if (documents.length === 0) {
    // No documents available
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
    return;
  }
  
  // Format documents for table
  const rows = documents.map(doc => {
    let status = 'Non disponible';
    if (doc.category === 'contracts') {
      if (doc.signedByEmployee && doc.signedByEmployer) {
        status = 'Signé';
      } else if (doc.signedByEmployee || doc.signedByEmployer) {
        status = 'Signature partielle';
      } else {
        status = 'En attente de signature';
      }
    } else if (doc.category === 'paystubs') {
      status = 'Généré';
    } else {
      status = doc.status || 'Actif';
    }
    
    try {
      const date = doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : 'N/A';
      const category = getCategoryLabel(doc.category || 'other');
      
      return [
        doc.title || 'Sans titre',
        category,
        doc.fileType || 'PDF',
        date,
        status
      ];
    } catch (err) {
      console.error("Error formatting document for PDF:", err);
      return [
        doc.title || 'Sans titre',
        doc.category === 'paystubs' ? 'Fiche de paie' : (doc.category || 'Autre'),
        'PDF',
        'N/A',
        status
      ];
    }
  });
  
  // Generate table with documents
  autoTable(doc, {
    startY: 40,
    head: [
      ['Titre', 'Catégorie', 'Type', 'Date', 'Statut']
    ],
    body: rows,
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
