
import jsPDF from 'jspdf';
import { Evaluation } from '@/hooks/useEmployeeEvaluations';
import autoTable from 'jspdf-autotable';

/**
 * Génère la section évaluations
 */
export const generateEvaluationsTab = (doc: jsPDF, startY: number, evaluations?: Evaluation[]) => {
  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.setFont('helvetica', 'bold');
  doc.text('Évaluations', 14, startY);
  
  if (!evaluations || evaluations.length === 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Aucune évaluation disponible pour cet employé.', 14, startY + 15);
    return startY + 30; // Retourne la position Y mise à jour
  }
  
  // Display evaluations in a table
  autoTable(doc, {
    startY: startY + 10,
    head: [['Titre', 'Date', 'Évaluateur', 'Statut']],
    body: evaluations.map(evaluation => [
      evaluation.title,
      evaluation.date,
      evaluation.evaluator,
      evaluation.status
    ]),
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9
    },
    margin: { left: 14, right: 14 }
  });
  
  // Récupérer la position finale du tableau
  const finalY = (doc as any).lastAutoTable.finalY || startY + 30;
  return finalY + 10; // Retourne la position Y mise à jour avec une marge
};
