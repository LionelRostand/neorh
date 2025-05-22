
import jsPDF from 'jspdf';

/**
 * Adds standard additional articles to the contract
 */
export const addAdditionalArticles = (
  doc: jsPDF,
  margin: number = 20,
  startY: number = 0
): number => {
  let yPosition = startY;
  
  // Article - Horaires de travail
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102); // Bleu foncé pour les titres d'article
  doc.text("Article 6 - Horaires de travail", margin, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text("Le/La Salarié(e) sera soumis(e) à l'horaire en vigueur dans l'entreprise, soit actuellement 35 heures hebdomadaires.", margin, yPosition);
  yPosition += 7;
  doc.text("- Du lundi au vendredi : de 9h00 à 17h00, avec une pause déjeuner d'une heure.", margin, yPosition);
  
  yPosition += 12;
  
  // Article - Congés payés
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text("Article 7 - Congés payés", margin, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text("Le/La Salarié(e) bénéficiera des congés payés institués par les dispositions légales et conventionnelles, soit 2,5 jours", margin, yPosition);
  yPosition += 7;
  doc.text("ouvrables par mois de travail effectif.", margin, yPosition);
  
  yPosition += 12;
  
  // Article - Obligations professionnelles
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text("Article 8 - Obligations professionnelles", margin, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text("Le/La Salarié(e) s'engage à respecter les directives et instructions émanant de la Direction et à se conformer aux règles", margin, yPosition);
  yPosition += 7;
  doc.text("en vigueur au sein de l'entreprise.", margin, yPosition);
  yPosition += 7;
  
  doc.text("Le/La Salarié(e) s'engage à informer l'Employeur, sans délai, de tout changement qui interviendrait dans les situations", margin, yPosition);
  yPosition += 7;
  doc.text("qu'il/elle a signalées lors de son embauche (adresse, situation de famille, etc.).", margin, yPosition);
  
  // Reset text color for subsequent content
  doc.setTextColor(0, 0, 0);
  
  return yPosition + 12;
};
