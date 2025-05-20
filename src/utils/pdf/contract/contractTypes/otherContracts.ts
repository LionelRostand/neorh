
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ContractData } from '../../types/contractTypes';

/**
 * Generates the content for an interim contract
 */
export const generateInterimContent = (
  doc: jsPDF, 
  contractData: ContractData, 
  margin: number = 20, 
  startY: number = 0
): number => {
  let yPosition = startY;
  
  // Contenu simplifié pour intérim
  doc.setFont('helvetica', 'bold');
  doc.text('Contrat de mission intérimaire', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Mission: ${contractData.position}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Durée: Du ${format(new Date(contractData.startDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  
  if (contractData.endDate) {
    yPosition += 7;
    doc.text(`au ${format(new Date(contractData.endDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  }
  
  yPosition += 10;
  doc.text(`Rémunération: ${contractData.salary} € brut annuel`, margin, yPosition);
  
  return yPosition + 30;
};

/**
 * Generates the content for an internship agreement
 */
export const generateStageContent = (
  doc: jsPDF, 
  contractData: ContractData, 
  margin: number = 20, 
  startY: number = 0
): number => {
  let yPosition = startY;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Convention de stage', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Stagiaire: ${contractData.employeeName}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Poste: ${contractData.position}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Période: Du ${format(new Date(contractData.startDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  
  if (contractData.endDate) {
    yPosition += 7;
    doc.text(`au ${format(new Date(contractData.endDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  }
  
  yPosition += 10;
  doc.text(`Gratification: ${contractData.salary} €`, margin, yPosition);
  
  return yPosition + 30;
};

/**
 * Generates the content for an apprenticeship contract
 */
export const generateApprentissageContent = (
  doc: jsPDF, 
  contractData: ContractData, 
  margin: number = 20, 
  startY: number = 0
): number => {
  let yPosition = startY;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Contrat d\'apprentissage', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Apprenti: ${contractData.employeeName}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Formation: ${contractData.position}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Durée: Du ${format(new Date(contractData.startDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  
  if (contractData.endDate) {
    yPosition += 7;
    doc.text(`au ${format(new Date(contractData.endDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  }
  
  yPosition += 10;
  doc.text(`Rémunération: ${contractData.salary} € brut annuel`, margin, yPosition);
  
  return yPosition + 30;
};

/**
 * Generates the content for a freelance service contract
 */
export const generateFreelanceContent = (
  doc: jsPDF, 
  contractData: ContractData, 
  margin: number = 20, 
  startY: number = 0
): number => {
  let yPosition = startY;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Contrat de prestation de services', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Prestataire: ${contractData.employeeName}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Mission: ${contractData.position}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Début de la prestation: ${format(new Date(contractData.startDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  
  if (contractData.endDate) {
    yPosition += 7;
    doc.text(`Fin de la prestation: ${format(new Date(contractData.endDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  }
  
  yPosition += 10;
  doc.text(`Montant des honoraires: ${contractData.salary} € HT`, margin, yPosition);
  
  return yPosition + 30;
};

/**
 * Generates a default contract content when type is not recognized
 */
export const generateDefaultContent = (
  doc: jsPDF, 
  contractData: ContractData, 
  margin: number = 20, 
  startY: number = 0
): number => {
  let yPosition = startY;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Contrat de travail', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Employé(e): ${contractData.employeeName}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Poste: ${contractData.position}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Type de contrat: ${contractData.type}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Date de début: ${format(new Date(contractData.startDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  
  if (contractData.endDate) {
    yPosition += 7;
    doc.text(`Date de fin: ${format(new Date(contractData.endDate), 'dd/MM/yyyy', { locale: fr })}`, margin, yPosition);
  }
  
  yPosition += 10;
  doc.text(`Rémunération: ${contractData.salary} € brut annuel`, margin, yPosition);
  
  return yPosition + 30;
};
