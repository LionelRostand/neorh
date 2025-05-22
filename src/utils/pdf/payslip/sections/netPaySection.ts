
import jsPDF from 'jspdf';
import { SocialContribution } from '../types';

/**
 * Calculates the net pay amount
 */
export const calculateNetPay = (totalBrut: number, totalCotisations: number): number => {
  return totalBrut - totalCotisations;
};

/**
 * Calculates the taxable net income
 */
export const calculateNetTaxable = (
  totalBrut: number, 
  totalCotisations: number, 
  contributions: SocialContribution[]
): number => {
  // CSG/CRDS non-déductible is not considered in the calculation of taxable net income
  const nonDeductibleContributions = contributions
    .filter(c => c.name.includes('CSG/CRDS non déductible'))
    .reduce((sum, c) => sum + c.amount, 0);
  
  return totalBrut - (totalCotisations - nonDeductibleContributions);
};

/**
 * Renders the net pay section on the payslip
 */
export const addNetPaySection = (
  doc: jsPDF, 
  totalBrut: number, 
  totalCotisations: number, 
  startY: number
): number => {
  let tableY = startY;
  
  // Net à payer
  const netAPayer = calculateNetPay(totalBrut, totalCotisations);
  doc.setFillColor(200, 230, 210);
  doc.rect(14, tableY, 182, 10, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('NET À PAYER', 16, tableY + 6.5);
  doc.text(`${netAPayer.toFixed(2)} €`, 170, tableY + 6.5);
  tableY += 16;
  
  return tableY;
};

/**
 * Adds the annual cumulative information section
 */
export const addCumulSection = (
  doc: jsPDF, 
  totalBrut: number, 
  netImposable: number,
  startY: number
): number => {
  let tableY = startY;
  
  // Cumuls annuels
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('CUMULS', 14, tableY);
  tableY += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.text('Net imposable', 14, tableY);
  doc.text(`${netImposable.toFixed(2)} €`, 170, tableY);
  tableY += 8;
  
  // Cumul annuel brut
  const mois = new Date().getMonth() + 1;
  const cumulBrut = totalBrut * mois;
  doc.text('Cumul brut annuel', 14, tableY);
  doc.text(`${cumulBrut.toFixed(2)} €`, 170, tableY);
  tableY += 16;
  
  return tableY;
};
