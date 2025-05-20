
import jsPDF from 'jspdf';

/**
 * Adds the signature section to the contract
 */
export const addSignatureSection = (
  doc: jsPDF, 
  margin: number = 20, 
  startY: number = 0
): number => {
  let yPosition = startY;
  
  // Section signatures
  doc.text('Fait en deux exemplaires originaux à [Ville], le [date]', margin, yPosition);
  
  yPosition += 30;
  
  // Créer deux colonnes pour les signatures
  const middleX = doc.internal.pageSize.width / 2;
  
  // Signature de l'employeur (colonne gauche)
  doc.text('Signature de l\'Employeur', margin, yPosition);
  doc.text('Signature du/de la Salarié(e)', middleX + 10, yPosition);
  
  yPosition += 7;
  
  // Mention "Lu et approuvé"
  doc.text('Précédée de la mention « Lu et approuvé »', margin, yPosition);
  doc.text('Précédée de la mention « Lu et approuvé »', middleX + 10, yPosition);
  
  // Lignes de signature
  yPosition -= 15;
  doc.line(margin, yPosition + 30, margin + 80, yPosition + 30);
  doc.line(middleX + 10, yPosition + 30, middleX + 90, yPosition + 30);
  
  return yPosition + 40;
};
