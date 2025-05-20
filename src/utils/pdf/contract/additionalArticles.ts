
import jsPDF from 'jspdf';

/**
 * Adds additional standard articles to all contracts
 */
export const addAdditionalArticles = (
  doc: jsPDF, 
  margin: number = 20, 
  startY: number = 0
): number => {
  let yPosition = startY;
  
  // Article 5 - Horaires de travail
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#003366');
  doc.text('Article 5 - Horaires de travail', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#000000');
  doc.text('Le/La Salarié(e) sera soumis(e) à l\'horaire en vigueur dans l\'entreprise, soit actuellement 35 heures hebdomadaire.', margin, yPosition);
  yPosition += 7;
  doc.text('- Du lundi au vendredi : de 9h00 à 17h00, avec une pause déjeuner d\'une heure.', margin, yPosition);
  yPosition += 15;
  
  // Article 6 - Congés payés
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#003366');
  doc.text('Article 6 - Congés payés', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal'); 
  doc.setTextColor('#000000');
  doc.text('Le/La Salarié(e) bénéficiera des congés payés institués par les dispositions légales et conventionnelles, soit 2,5 jours', margin, yPosition);
  yPosition += 7;
  doc.text('ouvrables par mois de travail effectif.', margin, yPosition);
  yPosition += 15;
  
  // Article 7 - Obligations professionnelles
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#003366');
  doc.text('Article 7 - Obligations professionnelles', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#000000');
  doc.text('Le/La Salarié(e) s\'engage à respecter les directives et instructions émanant de la Direction et à se conformer aux règles', margin, yPosition);
  yPosition += 7;
  doc.text('en vigueur au sein de l\'entreprise.', margin, yPosition);
  yPosition += 10;
  doc.text('Le/La Salarié(e) s\'engage à informer l\'Employeur, sans délai, de tout changement qui interviendrait dans les situations', margin, yPosition);
  yPosition += 7;
  doc.text('personnelles qui ont été déclarées au moment de l\'engagement.', margin, yPosition);
  
  return yPosition + 20;
};
