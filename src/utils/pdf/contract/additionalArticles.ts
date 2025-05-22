
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
  
  // Vérifier si nous avons besoin d'ajouter une nouvelle page
  if (yPosition > doc.internal.pageSize.height - 150) {
    doc.addPage();
    yPosition = 40;
  }
  
  // Article - Horaires de travail
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102); // Bleu pour les titres d'articles
  doc.text("Article 6 - Horaires de travail", margin, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0); // Noir pour le texte standard
  doc.text("Le/La Salarié(e) sera soumis(e) à l'horaire en vigueur dans l'entreprise, soit actuellement 35 heures hebdomadaires.", margin, yPosition);
  yPosition += 7;
  doc.text("- Du lundi au vendredi : de 9h00 à 17h00, avec une pause déjeuner d'une heure.", margin, yPosition);
  
  yPosition += 12;
  
  // Article - Congés payés
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102); // Bleu pour les titres d'articles
  doc.text("Article 7 - Congés payés", margin, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0); // Noir pour le texte standard
  doc.text("Le/La Salarié(e) bénéficiera des congés payés institués par les dispositions légales et conventionnelles, soit 2,5 jours", margin, yPosition);
  yPosition += 7;
  doc.text("ouvrables par mois de travail effectif.", margin, yPosition);
  
  // Vérifier si nous avons besoin d'ajouter une nouvelle page
  if (yPosition > doc.internal.pageSize.height - 150) {
    doc.addPage();
    yPosition = 40;
  } else {
    yPosition += 12;
  }
  
  // Article - Obligations professionnelles
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102); // Bleu pour les titres d'articles
  doc.text("Article 8 - Obligations professionnelles", margin, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0); // Noir pour le texte standard
  doc.text("Le/La Salarié(e) s'engage à respecter les directives et instructions émanant de la Direction et à se conformer aux règles", margin, yPosition);
  yPosition += 7;
  doc.text("en vigueur au sein de l'entreprise.", margin, yPosition);
  yPosition += 7;
  
  doc.text("Le/La Salarié(e) s'engage à informer l'Employeur, sans délai, de tout changement qui interviendrait dans les situations", margin, yPosition);
  yPosition += 7;
  doc.text("qu'il/elle a signalées lors de son embauche (adresse, situation de famille, etc.).", margin, yPosition);
  
  // Vérifier si nous avons besoin d'ajouter une nouvelle page
  if (yPosition > doc.internal.pageSize.height - 150) {
    doc.addPage();
    yPosition = 40;
  } else {
    yPosition += 12;
  }
  
  // Article - Confidentialité
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102); // Bleu pour les titres d'articles
  doc.text("Article 9 - Confidentialité", margin, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0); // Noir pour le texte standard
  doc.text("Le/La Salarié(e) s'engage à observer la plus grande discrétion sur l'ensemble des informations qu'il/elle pourrait", margin, yPosition);
  yPosition += 7;
  doc.text("recueillir à l'occasion de ses fonctions ou du fait de sa présence dans l'entreprise concernant celle-ci, ses clients", margin, yPosition);
  yPosition += 7;
  doc.text("et fournisseurs. Cette obligation de confidentialité se prolonge après la rupture du contrat de travail.", margin, yPosition);
  
  return yPosition + 20;
};
