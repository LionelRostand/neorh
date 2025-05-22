
import jsPDF from 'jspdf';
import { PayslipData } from '../types';

/**
 * Renders the employee information section on the payslip
 */
export const addEmployeeInfoSection = (doc: jsPDF, data: PayslipData, startY: number = 50): number => {
  let yPosition = startY;
  
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
  
  return yPosition;
};
