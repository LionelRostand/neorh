
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ContractData } from '../../types/contractTypes';

/**
 * Generates the content for a CDD (fixed-term) contract
 */
export const generateCDDContent = (
  doc: jsPDF, 
  contractData: ContractData, 
  margin: number = 20, 
  startY: number = 0
): number => {
  let yPosition = startY;
  
  // Article 1 - Engagement
  doc.setFont('helvetica', 'bold');
  doc.text('Article 1 - Engagement et durée', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Le salarié est engagé en qualité de ${contractData.position} au sein du département ${contractData.departmentName || ''}.`, margin, yPosition);
  yPosition += 7;
  
  const startDateFormatted = format(new Date(contractData.startDate), 'dd MMMM yyyy', { locale: fr });
  let endDateText = "indéterminée";
  
  if (contractData.endDate) {
    endDateText = format(new Date(contractData.endDate), 'dd MMMM yyyy', { locale: fr });
  }
  
  doc.text(`Ce contrat est conclu pour une durée déterminée. Il prendra effet le ${startDateFormatted}`, margin, yPosition);
  yPosition += 7;
  doc.text(`et se terminera le ${endDateText}.`, margin, yPosition);
  
  // Article 2 - Motif du recours au CDD
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Article 2 - Motif du recours au CDD', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Le présent contrat est conclu pour le motif suivant : accroissement temporaire d'activité.`, margin, yPosition);
  
  // Article 3 - Période d'essai
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Article 3 - Période d\'essai', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Le présent contrat est soumis à une période d'essai d'un mois.`, margin, yPosition);
  yPosition += 7;
  doc.text(`Durant cette période, chacune des parties pourra rompre le contrat sans indemnité ni préavis.`, margin, yPosition);
  
  // Article 4 - Fonctions
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Article 4 - Fonctions', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Le salarié exercera les fonctions de ${contractData.position}.`, margin, yPosition);
  
  // Article 5 - Rémunération
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Article 5 - Rémunération', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`La rémunération brute mensuelle du salarié est fixée à ${(parseInt(contractData.salary)/12).toFixed(2)} euros.`, margin, yPosition);
  
  // Article 6 - Indemnité de fin de contrat
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Article 6 - Indemnité de fin de contrat', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`À l'issue du contrat, le salarié percevra une indemnité de fin de contrat égale à 10% de`, margin, yPosition);
  yPosition += 7;
  doc.text(`la rémunération totale brute qui lui aura été versée pendant la durée du contrat.`, margin, yPosition);
  
  return yPosition + 20;
};
