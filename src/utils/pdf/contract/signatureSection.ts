
import jsPDF from 'jspdf';

/**
 * Adds the signature section to the contract
 */
export const addSignatureSection = (
  doc: jsPDF, 
  city: string = 'Paris',
  margin: number = 20, 
  startY: number = 0,
  employeeSignatureDate?: string,
  employerSignatureDate?: string
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
  
  // Draw signature boxes
  // Employer signature box
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);
  doc.rect(margin, yPosition - 25, 80, 35);
  
  // Employee signature box
  doc.rect(middleX + 10, yPosition - 25, 80, 35);
  
  // Si nous avons des signatures, ajouter une indication visuelle
  if (employerSignatureDate) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(0, 0, 150);
    let employerDate = new Date();
    try {
      employerDate = new Date(employerSignatureDate);
    } catch (e) {
      console.error("Invalid employer signature date format");
    }
    doc.text(`Signé électroniquement le ${employerDate.toLocaleDateString('fr-FR')}`, margin + 5, yPosition - 20);
    
    // Ajouter une marque de signature dans la case
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text("SIGNATURE ÉLECTRONIQUE", margin + 10, yPosition - 5);
    
    // Ajouter une signature graphique plus visible et élaborée
    doc.setDrawColor(0, 0, 150);
    doc.setLineWidth(0.8);
    
    // Dessiner une signature stylisée plus visible
    const sigStartX = margin + 15;
    const sigY = yPosition - 15;
    
    // Création d'une signature plus élaborée et visible
    doc.line(sigStartX, sigY, sigStartX + 10, sigY - 5);
    doc.line(sigStartX + 10, sigY - 5, sigStartX + 25, sigY + 2);
    doc.line(sigStartX + 25, sigY + 2, sigStartX + 40, sigY - 8);
    doc.line(sigStartX + 40, sigY - 8, sigStartX + 50, sigY);
    
    // Tampon "Approuvé"
    doc.setFillColor(0, 0, 150);
    doc.setTextColor(0, 0, 150);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold-italic');
    doc.text("Lu et approuvé", margin + 15, yPosition - 8);
    
    doc.setFont('helvetica', 'normal');
  }
  
  if (employeeSignatureDate) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(0, 0, 150);
    let employeeDate = new Date();
    try {
      employeeDate = new Date(employeeSignatureDate);
    } catch (e) {
      console.error("Invalid employee signature date format");
    }
    doc.text(`Signé électroniquement le ${employeeDate.toLocaleDateString('fr-FR')}`, middleX + 15, yPosition - 20);
    
    // Ajouter une marque de signature dans la case
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text("SIGNATURE ÉLECTRONIQUE", middleX + 15, yPosition - 5);
    
    // Ajouter une signature graphique plus visible et différente de celle de l'employeur
    doc.setDrawColor(0, 0, 150);
    doc.setLineWidth(0.8);
    
    // Dessiner une signature stylisée différente pour l'employé
    const sigStartX = middleX + 20;
    const sigY = yPosition - 15;
    
    // Création d'une signature cursive stylisée
    doc.line(sigStartX, sigY, sigStartX + 8, sigY + 5);
    doc.line(sigStartX + 8, sigY + 5, sigStartX + 15, sigY - 3);
    doc.line(sigStartX + 15, sigY - 3, sigStartX + 30, sigY + 4);
    doc.line(sigStartX + 30, sigY + 4, sigStartX + 45, sigY - 5);
    doc.line(sigStartX + 45, sigY - 5, sigStartX + 50, sigY);
    
    // Tampon "Approuvé"
    doc.setFillColor(0, 0, 150);
    doc.setTextColor(0, 0, 150);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold-italic');
    doc.text("Lu et approuvé", middleX + 20, yPosition - 8);
    
    doc.setFont('helvetica', 'normal');
  }
  
  // Revenir à la couleur standard pour le reste du document
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);
  
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
  
  // Add footer with confidentiality notice
  yPosition += 40;
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('Ce document est strictement confidentiel et établi conformément au droit du travail français. Il ne constitue pas un conseil juridique.',
    doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  
  return yPosition;
};
