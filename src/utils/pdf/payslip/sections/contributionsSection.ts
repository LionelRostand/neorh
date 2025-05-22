
import jsPDF from 'jspdf';
import { SocialContribution } from '../types';

/**
 * Generates the list of social contributions according to French regulations
 */
export const generateSocialContributions = (totalBrut: number): SocialContribution[] => {
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
  
  // Calculate contribution amounts
  return contributions.map(contribution => ({
    ...contribution,
    amount: contribution.base * contribution.rate
  }));
};

/**
 * Calculates the total contributions amount
 */
export const calculateTotalContributions = (contributions: SocialContribution[]): number => {
  return contributions.reduce((sum, contribution) => sum + contribution.amount, 0);
};

/**
 * Renders the social contributions section on the payslip
 */
export const addContributionsSection = (
  doc: jsPDF, 
  totalBrut: number, 
  startY: number
): { tableY: number; totalCotisations: number; contributions: SocialContribution[] } => {
  let tableY = startY;
  
  doc.setFont('helvetica', 'bold');
  doc.text('COTISATIONS SOCIALES', 16, tableY + 5);
  tableY += 10;
  
  doc.setFont('helvetica', 'normal');
  
  // Get the social contributions
  const contributions = generateSocialContributions(totalBrut);
  
  // Calculate total contributions
  const totalCotisations = calculateTotalContributions(contributions);
  
  // Render each contribution
  contributions.forEach(contribution => {
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
  
  return { tableY, totalCotisations, contributions };
};
