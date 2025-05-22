
import jsPDF from 'jspdf';
import { PayslipData, PayslipResult, SocialContribution } from './types';
import { setupPayslipDocument, finalizeDocument, generatePayslipFilename } from './documentSetup';
import { addEmployeeInfoSection } from './sections/employeeInfoSection';
import { addSalarySection, calculateSalaryComponents } from './sections/salarySection';
import { addContributionsSection, calculateTotalContributions } from './sections/contributionsSection';
import { addNetPaySection, addCumulSection, calculateNetTaxable } from './sections/netPaySection';
import { addLeavesSection } from './sections/leavesSection';

/**
 * Main function to generate a payslip PDF
 * Orchestrates all the sections of the payslip
 */
export const generatePayslipPdf = (data: PayslipData): PayslipResult => {
  // Initialize document
  const doc = new jsPDF();
  
  // Setup the document with basic information
  setupPayslipDocument(doc, data);
  
  // Position Y of starting position
  let yPosition = 50;
  
  // Add employee information section
  yPosition = addEmployeeInfoSection(doc, data, yPosition);
  
  // Calculate salary components and add salary section
  const { totalBrut } = calculateSalaryComponents(data);
  yPosition = addSalarySection(doc, data, yPosition);
  
  // Add contributions section
  const { tableY: newYPosition, totalCotisations, contributions } = 
    addContributionsSection(doc, totalBrut, yPosition);
  yPosition = newYPosition;
  
  // Add net pay section
  yPosition = addNetPaySection(doc, totalBrut, totalCotisations, yPosition);
  
  // Add leaves section
  yPosition = addLeavesSection(doc, data.leaveAllocation, yPosition);
  
  // Calculate net taxable income for cumul section
  const netImposable = calculateNetTaxable(totalBrut, totalCotisations, contributions);
  
  // Add cumulative section with annual totals
  yPosition = addCumulSection(doc, totalBrut, netImposable, yPosition);
  
  // Finalize the document with footers and page numbers
  finalizeDocument(doc);
  
  // Generate filename
  const fileName = generatePayslipFilename(data.employee.name, data.period);
  
  // Return the document and functions to use it
  return {
    fileName,
    pdfBlob: doc.output('blob'),
    saveToFile: () => doc.save(fileName),
  };
};

// Re-export types for convenience
export * from './types';
