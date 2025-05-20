
import jsPDF from 'jspdf';

/**
 * Adds collective agreement reference if specified
 */
export const addCollectiveAgreement = (
  doc: jsPDF,
  conventionCollective?: string,
  margin: number = 20,
  startY: number = 145
): number => {
  let yPosition = startY;
  
  if (conventionCollective) {
    doc.setFont('helvetica', 'bold');
    doc.text('Convention collective applicable', margin, yPosition);
    yPosition += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`Le présent contrat est soumis à la convention collective ${conventionCollective}.`, margin, yPosition);
    yPosition += 10;
  }
  
  return yPosition;
};
