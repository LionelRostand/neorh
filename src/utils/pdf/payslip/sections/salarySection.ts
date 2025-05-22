
import jsPDF from 'jspdf';
import { PayslipData } from '../types';

/**
 * Calculates the monthly salary and overtime from annual salary data
 */
export const calculateSalaryComponents = (data: PayslipData) => {
  const annualSalary = parseFloat(data.annualSalary.replace(/[^0-9,.]/g, '').replace(',', '.'));
  const monthlySalary = isNaN(annualSalary) ? 0 : annualSalary / 12;
  
  // Calculate overtime if present
  let overtimePay = 0;
  if (data.overtimeHours && parseFloat(data.overtimeHours) > 0) {
    const hours = parseFloat(data.overtimeHours);
    const rate = data.overtimeRate ? parseFloat(data.overtimeRate) / 100 : 0.25;
    
    const hourlyRate = monthlySalary / 151.67;
    overtimePay = hours * hourlyRate * (1 + rate);
  }
  
  const totalBrut = monthlySalary + overtimePay;
  
  return {
    annualSalary,
    monthlySalary,
    overtimePay,
    totalBrut,
    formattedMonthlySalary: monthlySalary.toFixed(2),
  };
};

/**
 * Renders the salary section on the payslip
 */
export const addSalarySection = (doc: jsPDF, data: PayslipData, startY: number): number => {
  let tableY = startY;
  
  // Table headers
  doc.setFillColor(240, 240, 240);
  doc.rect(14, tableY, 182, 8, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('RUBRIQUES', 16, tableY + 5.5);
  doc.text('BASE', 100, tableY + 5.5);
  doc.text('TAUX', 125, tableY + 5.5);
  doc.text('MONTANT (€)', 170, tableY + 5.5);
  
  tableY += 8;
  
  // Calculate the salary components
  const { monthlySalary, overtimePay, totalBrut, formattedMonthlySalary } = calculateSalaryComponents(data);
  
  // Salaire de base
  doc.setFont('helvetica', 'normal');
  doc.text('Salaire de base', 16, tableY + 5);
  doc.text('151.67 h', 100, tableY + 5);
  doc.text(`${formattedMonthlySalary} €`, 170, tableY + 5);
  tableY += 8;
  
  // Heures supplémentaires si présentes
  if (data.overtimeHours && parseFloat(data.overtimeHours) > 0) {
    const rate = data.overtimeRate ? parseFloat(data.overtimeRate) / 100 : 0.25;
    
    doc.text('Heures supplémentaires', 16, tableY + 5);
    doc.text(`${data.overtimeHours} h`, 100, tableY + 5);
    doc.text(`${(rate * 100).toFixed(0)}%`, 125, tableY + 5);
    doc.text(`${overtimePay.toFixed(2)} €`, 170, tableY + 5);
    tableY += 8;
  }
  
  // Total brut
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(240, 240, 240);
  doc.rect(14, tableY, 182, 8, 'F');
  doc.text('TOTAL BRUT', 16, tableY + 5.5);
  doc.text(`${totalBrut.toFixed(2)} €`, 170, tableY + 5.5);
  tableY += 12;
  
  return tableY;
};
