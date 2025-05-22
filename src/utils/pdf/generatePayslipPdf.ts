
import jsPDF from 'jspdf';
import { Company } from '@/types/company';
import { Employee } from '@/types/employee';
import { formatDate } from 'date-fns';
import { fr } from 'date-fns/locale';
import { setupDocument, addPageFooter } from './documentSetup';
import { LeaveAllocation } from '@/hooks/leaves/types';

// Types pour les données de la fiche de paie
export interface PayslipData {
  employee: Employee;
  company: Company;
  period: string;
  annualSalary: string;
  overtimeHours?: string;
  overtimeRate?: string;
  date?: Date;
  leaveAllocation?: LeaveAllocation;
}

// Données des cotisations sociales
interface SocialContribution {
  name: string;
  base: number;
  rate: number;
  amount: number;
}

/**
 * Génère un document PDF de fiche de paie selon la réglementation française
 */
export const generatePayslipPdf = (data: PayslipData) => {
  // Initialiser le document
  const doc = new jsPDF();
  
  // Configurer les propriétés du document
  doc.setProperties({
    title: `Fiche de paie - ${data.employee.name}`,
    subject: `Période: ${data.period}`,
    author: data.company.name,
    creator: 'Système RH'
  });
  
  // Configuration de base du document avec le logo et les infos de l'entreprise
  setupDocument(doc, 'Bulletin de Salaire', data.employee.name, undefined, undefined, data.company);
  
  // Position Y de départ pour le contenu après les en-têtes
  let yPosition = 50;
  
  // Style de base
  doc.setFontSize(12);
  doc.setTextColor('#000000');
  
  // Information salarié et période
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMATIONS SALARIÉ', 14, yPosition);
  yPosition += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Nom et prénom: ${data.employee.name}`, 14, yPosition);
  yPosition += 6;
  
  if (data.employee.position) {
    doc.text(`Poste: ${data.employee.position}`, 14, yPosition);
    yPosition += 6;
  }
  
  if (data.employee.department) {
    doc.text(`Département: ${data.employee.department}`, 14, yPosition);
    yPosition += 6;
  }
  
  // Numéro de sécurité sociale (fictif pour l'exemple)
  doc.text(`N° Sécurité sociale: 1 XX XX XX XXX XXX XX`, 14, yPosition);
  yPosition += 6;
  
  // Information période
  doc.setFont('helvetica', 'bold');
  doc.text(`PÉRIODE DE PAIE: ${data.period}`, 14, yPosition);
  yPosition += 12;
  
  // Table des rubriques de paie
  const startY = yPosition;
  
  // En-têtes du tableau
  doc.setFillColor(240, 240, 240);
  doc.rect(14, startY, 182, 8, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('RUBRIQUES', 16, startY + 5.5);
  doc.text('BASE', 100, startY + 5.5);
  doc.text('TAUX', 125, startY + 5.5);
  doc.text('MONTANT (€)', 170, startY + 5.5);
  
  let tableY = startY + 8;
  
  // Calcul du salaire brut mensuel
  const annualSalary = parseFloat(data.annualSalary.replace(/[^0-9,.]/g, '').replace(',', '.'));
  const monthlySalary = isNaN(annualSalary) ? 0 : annualSalary / 12;
  const formattedMonthlySalary = monthlySalary.toFixed(2);
  
  // Salaire de base
  doc.setFont('helvetica', 'normal');
  doc.text('Salaire de base', 16, tableY + 5);
  doc.text('151.67 h', 100, tableY + 5);
  doc.text(`${formattedMonthlySalary} €`, 170, tableY + 5);
  tableY += 8;
  
  // Heures supplémentaires si présentes
  let overtimePay = 0;
  if (data.overtimeHours && parseFloat(data.overtimeHours) > 0) {
    const hours = parseFloat(data.overtimeHours);
    const rate = data.overtimeRate ? parseFloat(data.overtimeRate) / 100 : 0.25;
    
    const hourlyRate = monthlySalary / 151.67;
    overtimePay = hours * hourlyRate * (1 + rate);
    
    doc.text('Heures supplémentaires', 16, tableY + 5);
    doc.text(`${data.overtimeHours} h`, 100, tableY + 5);
    doc.text(`${(rate * 100).toFixed(0)}%`, 125, tableY + 5);
    doc.text(`${overtimePay.toFixed(2)} €`, 170, tableY + 5);
    tableY += 8;
  }
  
  // Total brut
  const totalBrut = monthlySalary + overtimePay;
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(240, 240, 240);
  doc.rect(14, tableY, 182, 8, 'F');
  doc.text('TOTAL BRUT', 16, tableY + 5.5);
  doc.text(`${totalBrut.toFixed(2)} €`, 170, tableY + 5.5);
  tableY += 12;
  
  // Cotisations sociales
  doc.setFont('helvetica', 'bold');
  doc.text('COTISATIONS SOCIALES', 16, tableY + 5);
  tableY += 10;
  
  doc.setFont('helvetica', 'normal');
  
  // Liste complète des cotisations sociales selon la réglementation française
  const contributions: SocialContribution[] = [
    { name: 'Sécurité sociale - Maladie', base: totalBrut, rate: 0.0075, amount: 0 },
    { name: 'Sécurité sociale - Vieillesse plafonnée', base: totalBrut, rate: 0.069, amount: 0 },
    { name: 'Sécurité sociale - Vieillesse déplafonnée', base: totalBrut, rate: 0.004, amount: 0 },
    { name: 'Contribution autonomie solidaire', base: totalBrut, rate: 0.003, amount: 0 },
    { name: 'Assurance chômage', base: totalBrut, rate: 0.024, amount: 0 },
    { name: 'Retraite complémentaire (AGIRC-ARRCO)', base: totalBrut, rate: 0.0315, amount: 0 },
    { name: 'CEG (AGIRC-ARRCO)', base: totalBrut, rate: 0.0086, amount: 0 },
    { name: 'CSG déductible', base: totalBrut * 0.9825, rate: 0.068, amount: 0 },
    { name: 'CSG/CRDS non déductible', base: totalBrut * 0.9825, rate: 0.029, amount: 0 },
  ];
  
  // Calculer le montant de chaque cotisation
  let totalCotisations = 0;
  contributions.forEach(contribution => {
    contribution.amount = contribution.base * contribution.rate;
    totalCotisations += contribution.amount;
    
    doc.text(contribution.name, 16, tableY + 5);
    doc.text(`${contribution.base.toFixed(2)}`, 100, tableY + 5);
    doc.text(`${(contribution.rate * 100).toFixed(2)}%`, 125, tableY + 5);
    doc.text(`${contribution.amount.toFixed(2)} €`, 170, tableY + 5);
    tableY += 8;
  });
  
  // Total cotisations
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(240, 240, 240);
  doc.rect(14, tableY, 182, 8, 'F');
  doc.text('TOTAL COTISATIONS', 16, tableY + 5.5);
  doc.text(`${totalCotisations.toFixed(2)} €`, 170, tableY + 5.5);
  tableY += 12;
  
  // Net à payer
  const netAPayer = totalBrut - totalCotisations;
  doc.setFillColor(200, 230, 210);
  doc.rect(14, tableY, 182, 10, 'F');
  doc.setFontSize(12);
  doc.text('NET À PAYER', 16, tableY + 6.5);
  doc.text(`${netAPayer.toFixed(2)} €`, 170, tableY + 6.5);
  tableY += 16;
  
  // Congés payés et RTT
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('SOLDES DES CONGÉS ET RTT', 14, tableY);
  tableY += 8;
  
  // Récupérer les informations de congés et RTT depuis l'allocation si disponible
  const congesPayes = {
    acquis: data.leaveAllocation ? data.leaveAllocation.paidLeavesTotal : 25,
    pris: data.leaveAllocation ? data.leaveAllocation.paidLeavesUsed : 0,
    restant: data.leaveAllocation ? 
      data.leaveAllocation.paidLeavesTotal - data.leaveAllocation.paidLeavesUsed : 25
  };
  
  const rtt = {
    acquis: data.leaveAllocation ? data.leaveAllocation.rttTotal : 12, 
    pris: data.leaveAllocation ? data.leaveAllocation.rttUsed : 0,
    restant: data.leaveAllocation ? 
      data.leaveAllocation.rttTotal - data.leaveAllocation.rttUsed : 12
  };
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Congés payés', 14, tableY);
  doc.text(`Acquis: ${congesPayes.acquis}`, 60, tableY);
  doc.text(`Pris: ${congesPayes.pris}`, 100, tableY);
  doc.text(`Solde: ${congesPayes.restant}`, 140, tableY);
  tableY += 8;
  
  doc.text('RTT', 14, tableY);
  doc.text(`Acquis: ${rtt.acquis}`, 60, tableY);
  doc.text(`Pris: ${rtt.pris}`, 100, tableY);
  doc.text(`Solde: ${rtt.restant}`, 140, tableY);
  tableY += 16;
  
  // Net imposable (pour la déclaration d'impôt)
  const netImposable = totalBrut - (totalCotisations - contributions[7].amount - contributions[8].amount);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('CUMULS', 14, tableY);
  tableY += 8;
  doc.setFont('helvetica', 'normal');
  doc.text('Net imposable', 14, tableY);
  doc.text(`${netImposable.toFixed(2)} €`, 170, tableY);
  tableY += 8;
  
  // Cumul annuel brut (fictif pour l'exemple)
  const mois = new Date().getMonth() + 1;
  const cumulBrut = totalBrut * mois;
  doc.text('Cumul brut annuel', 14, tableY);
  doc.text(`${cumulBrut.toFixed(2)} €`, 170, tableY);
  tableY += 16;
  
  // Mentions légales
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Document à conserver sans limitation de durée. La présente fiche de paie ne constitue pas un document contractuel.', 14, 275);
  doc.text('Pour toute question concernant cette fiche de paie, veuillez contacter le service RH.', 14, 280);
  
  // Ajouter les numéros de page
  addPageFooter(doc);
  
  // Nom de fichier pour le téléchargement
  const fileName = `fiche_paie_${data.employee.name.replace(/\s+/g, '_')}_${data.period.replace(/\s+/g, '_')}.pdf`;
  
  // Renvoyer le document PDF
  return {
    fileName,
    pdfBlob: doc.output('blob'),
    saveToFile: () => doc.save(fileName),
  };
};
