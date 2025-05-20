
import jsPDF from 'jspdf';
import { Company } from '@/types/company';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Adds contract title and date
 */
export const addContractTitle = (
  doc: jsPDF, 
  contractType: string, 
  company?: Company,
  margin: number = 20
): number => {
  // Titre du contrat
  let yPosition = 65;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  
  let contractTitle = 'CONTRAT DE TRAVAIL';
  switch(contractType) {
    case 'CDI':
      contractTitle += ' À DURÉE INDÉTERMINÉE';
      break;
    case 'CDD':
      contractTitle += ' À DURÉE DÉTERMINÉE';
      break;
    case 'Interim':
      contractTitle += ' INTÉRIMAIRE';
      break;
    case 'Stage':
      contractTitle = 'CONVENTION DE STAGE';
      break;
    case 'Apprentissage':
      contractTitle = 'CONTRAT D\'APPRENTISSAGE';
      break;
    case 'Freelance':
      contractTitle = 'CONTRAT DE PRESTATION DE SERVICES';
      break;
  }
  
  // Centrer le titre
  const titleWidth = doc.getStringUnitWidth(contractTitle) * doc.getFontSize() / doc.internal.scaleFactor;
  const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
  doc.text(contractTitle, titleX, yPosition);
  
  yPosition += 20;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Date du contrat
  const today = format(new Date(), 'dd MMMM yyyy', { locale: fr });
  doc.text(`Fait à ${company?.city || 'Paris'}, le ${today}`, margin, yPosition);
  
  return yPosition + 15;
};
