
import jsPDF from 'jspdf';

/**
 * Adds standard additional articles to the contract
 */
export const addAdditionalArticles = (
  doc: jsPDF, 
  margin: number = 20, 
  startY: number = 0,
  workHours?: string
): number => {
  let yPosition = startY;
  
  // Article 5 - Working hours
  doc.setFont('helvetica', 'bold');
  doc.text('Article 5 - Horaires de travail', margin, yPosition);
  yPosition += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Le/La Salarié(e) sera soumis(e) à l\'horaire en vigueur dans l\'entreprise, soit actuellement 35 heures hebdomadaires.',
    margin, yPosition, { maxWidth: doc.internal.pageSize.width - 2 * margin }
  );
  yPosition += 7;
  
  doc.text(
    '- Du lundi au vendredi : de 9h00 à 17h00, avec une pause déjeuner d\'une heure.',
    margin, yPosition, { maxWidth: doc.internal.pageSize.width - 2 * margin }
  );
  yPosition += 15;
  
  // Article 6 - Paid leave
  doc.setFont('helvetica', 'bold');
  doc.text('Article 6 - Congés payés', margin, yPosition);
  yPosition += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Le/La Salarié(e) bénéficiera des congés payés institués par les dispositions légales et conventionnelles, soit 2,5 jours ouvrables par mois de travail effectif.',
    margin, yPosition, { maxWidth: doc.internal.pageSize.width - 2 * margin }
  );
  yPosition += 15;
  
  // Article 7 - Professional obligations
  doc.setFont('helvetica', 'bold');
  doc.text('Article 7 - Obligations professionnelles', margin, yPosition);
  yPosition += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Le/La Salarié(e) s\'engage à respecter les directives et instructions émanant de la Direction et à se conformer aux règles en vigueur dans l\'entreprise.',
    margin, yPosition, { maxWidth: doc.internal.pageSize.width - 2 * margin }
  );
  yPosition += 10;
  
  doc.text(
    'Le/La Salarié(e) s\'engage à informer l\'Employeur, sans délai, de tout changement qui interviendrait dans les situations qu\'il/elle a signalées lors de son embauche (adresse, situation de famille, etc.).',
    margin, yPosition, { maxWidth: doc.internal.pageSize.width - 2 * margin }
  );
  yPosition += 15;
  
  return yPosition;
};
