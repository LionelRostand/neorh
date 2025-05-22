
import jsPDF from 'jspdf';

/**
 * Adds the signature section to the contract
 */
export const addSignatureSection = (
  doc: jsPDF, 
  city: string = 'Paris',
  margin: number = 20, 
  startY: number = 0
): number => {
  let yPosition = startY;
  
  // "Fait en deux exemplaires" section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date();
  const dateStr = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  doc.text(`Fait en deux exemplaires originaux à ${city}, le ${dateStr}`, margin, yPosition);
  
  yPosition += 30;
  
  // Signature lines
  const middleX = doc.internal.pageSize.width / 2;
  
  // Draw signature lines
  doc.line(margin, yPosition, margin + 80, yPosition);
  doc.line(middleX + 10, yPosition, middleX + 90, yPosition);
  
  yPosition += 5;
  
  // Signature labels
  doc.setFontSize(10);
  doc.text('Signature de l\'Employeur', margin, yPosition);
  doc.text('Signature du/de la Salarié(e)', middleX + 10, yPosition);
  
  yPosition += 7;
  
  // "Lu et approuvé" mentions
  doc.setFontSize(8);
  doc.text('Précédée de la mention « Lu et approuvé »', margin, yPosition);
  doc.text('Précédée de la mention « Lu et approuvé »', middleX + 10, yPosition);
  
  return yPosition + 40;
};
