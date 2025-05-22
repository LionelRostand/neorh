
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
  doc.setTextColor(0, 51, 102); // Bleu pour les titres d'articles
  doc.text('Article 1 - Engagement', margin, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0); // Noir pour le texte standard
  doc.text(`L'employeur engage le/la Salarié(e) en qualité de ${contractData.position} au sein du département ${contractData.departmentName || ''}.`, margin, yPosition);
  yPosition += 7;
  doc.text('Ce contrat est conclu pour une durée indéterminée. Il prendra effet le ' + 
    format(new Date(contractData.startDate), 'dd MMMM yyyy', { locale: fr }) + '.', margin, yPosition);
  yPosition += 7;
  doc.text('Sous réserve des résultats de la visite médicale d\'embauche.', margin, yPosition);
  
  // Article 2 - Période d'essai
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102); // Bleu pour les titres d'articles
  doc.text('Article 2 - Période d\'essai', margin, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0); // Noir pour le texte standard
  doc.text(`Le présent contrat est soumis à une période d'essai de trois mois renouvelable une fois.`, margin, yPosition);
  yPosition += 7;
  doc.text(`Durant cette période, chacune des parties pourra rompre le contrat sans indemnité ni préavis, en respectant`, margin, yPosition);
  yPosition += 7;
  doc.text(`toutefois le délai de prévenance prévu par la loi.`, margin, yPosition);
  
  // Article 3 - Fonctions
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102); // Bleu pour les titres d'articles
  doc.text('Article 3 - Fonctions', margin, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0); // Noir pour le texte standard
  doc.text(`Le/La Salarié(e) exercera les fonctions de ${contractData.position}.`, margin, yPosition);
  yPosition += 7;
  doc.text(`Dans le cadre de ses fonctions, le/la Salarié(e) sera notamment chargé(e) des tâches suivantes (liste non limitative) :`, margin, yPosition);
  yPosition += 7;
  doc.text(`- Exécution des missions liées au poste de ${contractData.position}`, margin, yPosition);
  yPosition += 7;
  doc.text(`- Reporting à sa hiérarchie`, margin, yPosition);
  yPosition += 7;
  doc.text(`Ces fonctions sont susceptibles d'évoluer en fonction des besoins de l'entreprise.`, margin, yPosition);
  
  // Check if we need to add a new page
  if (yPosition > doc.internal.pageSize.height - 100) {
    doc.addPage();
    yPosition = 40;
  }
  
  // Article 4 - Rémunération
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102); // Bleu pour les titres d'articles
  doc.text('Article 4 - Rémunération', margin, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0); // Noir pour le texte standard
  doc.text(`En contrepartie de son travail, le/la Salarié(e) percevra une rémunération annuelle brute de ${contractData.salary} euros.`, margin, yPosition);
  yPosition += 7;
  doc.text(`Cette rémunération inclut toutes les heures supplémentaires effectuées dans la limite du contingent annuel fixé`, margin, yPosition);
  yPosition += 7;
  doc.text(`par la convention collective applicable.`, margin, yPosition);
  yPosition += 7;
  doc.text(`Cette rémunération sera versée sur 12 mois, à la fin de chaque mois.`, margin, yPosition);
  
  // Article 5 - Lieu de travail
  yPosition += 12;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102); // Bleu pour les titres d'articles
  doc.text('Article 5 - Lieu de travail', margin, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0); // Noir pour le texte standard
  doc.text(`Le/La Salarié(e) exercera ses fonctions à l'adresse du lieu de travail.`, margin, yPosition);
  yPosition += 7;
  doc.text(`Toutefois, compte tenu de la nature des activités de l'entreprise, le/la Salarié(e) est susceptible d'être amené(e)`, margin, yPosition);
  yPosition += 7;
  doc.text(`à se déplacer pour les besoins de son travail en France et à l'étranger.`, margin, yPosition);
  
  return yPosition + 10;
};
