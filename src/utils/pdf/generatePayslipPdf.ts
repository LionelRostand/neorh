
import jsPDF from 'jspdf';
import { Company } from '@/types/company';
import { Employee } from '@/types/employee';
import { formatDate } from 'date-fns';
import { fr } from 'date-fns/locale';
import { setupDocument, addPageFooter } from './documentSetup';

// Types pour les données de la fiche de paie
export interface PayslipData {
  employee: Employee;
  company: Company;
  period: string;
  annualSalary: string;
  overtimeHours?: string;
  overtimeRate?: string;
  date?: Date;
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
  
  // Sécurité sociale - Maladie
  doc.text('Sécurité sociale - Maladie', 16, tableY + 5);
  doc.text(`${totalBrut.toFixed(2)}`, 100, tableY + 5);
  doc.text('0.75%', 125, tableY + 5);
  const maladieAmount = totalBrut * 0.0075;
  doc.text(`${maladieAmount.toFixed(2)} €`, 170, tableY + 5);
  tableY += 8;
  
  // Sécurité sociale - Vieillesse plafonnée
  doc.text('Sécurité sociale - Vieillesse plafonnée', 16, tableY + 5);
  doc.text(`${totalBrut.toFixed(2)}`, 100, tableY + 5);
  doc.text('6.90%', 125, tableY + 5);
  const vieillesseAmount = totalBrut * 0.069;
  doc.text(`${vieillesseAmount.toFixed(2)} €`, 170, tableY + 5);
  tableY += 8;
  
  // Assurance chômage
  doc.text('Assurance chômage', 16, tableY + 5);
  doc.text(`${totalBrut.toFixed(2)}`, 100, tableY + 5);
  doc.text('2.40%', 125, tableY + 5);
  const chomageAmount = totalBrut * 0.024;
  doc.text(`${chomageAmount.toFixed(2)} €`, 170, tableY + 5);
  tableY += 8;
  
  // Retraite complémentaire
  doc.text('Retraite complémentaire', 16, tableY + 5);
  doc.text(`${totalBrut.toFixed(2)}`, 100, tableY + 5);
  doc.text('3.15%', 125, tableY + 5);
  const retraiteAmount = totalBrut * 0.0315;
  doc.text(`${retraiteAmount.toFixed(2)} €`, 170, tableY + 5);
  tableY += 8;
  
  // CSG déductible
  doc.text('CSG déductible', 16, tableY + 5);
  doc.text(`${totalBrut.toFixed(2)}`, 100, tableY + 5);
  doc.text('6.80%', 125, tableY + 5);
  const csgAmount = totalBrut * 0.068;
  doc.text(`${csgAmount.toFixed(2)} €`, 170, tableY + 5);
  tableY += 8;
  
  // CSG non déductible et CRDS
  doc.text('CSG/CRDS non déductible', 16, tableY + 5);
  doc.text(`${totalBrut.toFixed(2)}`, 100, tableY + 5);
  doc.text('2.90%', 125, tableY + 5);
  const crdsAmount = totalBrut * 0.029;
  doc.text(`${crdsAmount.toFixed(2)} €`, 170, tableY + 5);
  tableY += 12;
  
  // Total cotisations
  const totalCotisations = maladieAmount + vieillesseAmount + chomageAmount + retraiteAmount + csgAmount + crdsAmount;
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
  
  // Supposons qu'on récupère ces informations du formulaire ou des données
  const congesPayes = {
    acquis: 25,
    pris: 10,
    restant: 15
  };
  
  const rtt = {
    acquis: 12, 
    pris: 5,
    restant: 7
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
