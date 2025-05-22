
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ContractData } from '../../types/contractTypes';

/**
 * Generates the content for a CDI (permanent) contract
 */
export const generateCDIContent = (
  doc: jsPDF, 
  contractData: ContractData, 
  margin: number = 20, 
  startY: number = 0
): number => {
  let yPosition = startY;
  
  // Article 1 - Engagement
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Article 1 - Engagement', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Le salarié est engagé en qualité de ${contractData.position} au sein du département ${contractData.departmentName || ''}.`, margin, yPosition);
  yPosition += 7;
  doc.text('Ce contrat est conclu pour une durée indéterminée. Il prendra effet le ' + 
    format(new Date(contractData.startDate), 'dd MMMM yyyy', { locale: fr }) + '.', margin, yPosition);
  
  // Article 2 - Période d'essai
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Article 2 - Période d\'essai', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Le présent contrat est soumis à une période d'essai de trois mois renouvelable une fois.`, margin, yPosition);
  yPosition += 7;
  doc.text(`Durant cette période, chacune des parties pourra rompre le contrat sans indemnité ni préavis.`, margin, yPosition);
  
  // Article 3 - Fonctions
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Article 3 - Fonctions', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Le salarié exercera les fonctions de ${contractData.position}.`, margin, yPosition);
  yPosition += 7;
  doc.text(`Ces fonctions sont susceptibles d'évoluer en fonction des besoins de l'entreprise.`, margin, yPosition);
  
  // Article 4 - Rémunération
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Article 4 - Rémunération', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`La rémunération brute annuelle du salarié est fixée à ${contractData.salary} euros.`, margin, yPosition);
  yPosition += 7;
  doc.text(`Cette rémunération sera versée sur 12 mois, à la fin de chaque mois.`, margin, yPosition);
  
  return yPosition + 10;
};
