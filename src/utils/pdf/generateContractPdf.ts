
import jsPDF from 'jspdf';
import { Company } from '@/types/company';
import { 
  setupContractHeader, 
  addContractTitle, 
  addPartiesSection,
  addCollectiveAgreement,
  addPageFooter 
} from './contract/documentSetup';
import { addSignatureSection } from './contract/signatureSection';
import { addAdditionalArticles } from './contract/additionalArticles';
import { 
  generateCDIContent 
} from './contract/contractTypes/cdiContract';
import { 
  generateCDDContent 
} from './contract/contractTypes/cddContract';
import { 
  generateInterimContent,
  generateStageContent,
  generateApprentissageContent,
  generateFreelanceContent,
  generateDefaultContent
} from './contract/contractTypes/otherContracts';
import { saveContractAsDocument } from './contract/documentStorage';
import { ContractData, PdfResult } from './types/contractTypes';

/**
 * Génère un PDF de contrat selon le droit français
 */
export const generateContractPdf = (contractData: ContractData, company?: Company): PdfResult => {
  // Création du document PDF
  const doc = new jsPDF();
  
  // Configuration du document
  doc.setProperties({
    title: `Contrat de travail - ${contractData.employeeName}`,
    subject: `Contrat de travail ${contractData.type}`,
    author: company?.name || 'Système RH',
    creator: 'Application RH'
  });
  
  // Marges
  const margin = 20;
  
  // Style de texte par défaut
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor('#000000');
  
  // Setup document header with company info
  let yPosition = setupContractHeader(doc, company, margin);
  
  // Add contract title and date
  yPosition = addContractTitle(doc, contractData.type, company, margin);
  
  // Add parties information (employer and employee)
  yPosition = addPartiesSection(doc, contractData.employeeName, company, margin, yPosition);
  
  // Add collective agreement reference if specified
  yPosition = addCollectiveAgreement(doc, contractData.conventionCollective, margin, yPosition);
  
  // Add content based on contract type
  switch(contractData.type) {
    case 'CDI':
      yPosition = generateCDIContent(doc, contractData, margin, yPosition);
      break;
    case 'CDD':
      yPosition = generateCDDContent(doc, contractData, margin, yPosition);
      break;
    case 'Interim':
      yPosition = generateInterimContent(doc, contractData, margin, yPosition);
      break;
    case 'Stage':
      yPosition = generateStageContent(doc, contractData, margin, yPosition);
      break;
    case 'Apprentissage':
      yPosition = generateApprentissageContent(doc, contractData, margin, yPosition);
      break;
    case 'Freelance':
      yPosition = generateFreelanceContent(doc, contractData, margin, yPosition);
      break;
    default:
      yPosition = generateDefaultContent(doc, contractData, margin, yPosition);
  }
  
  // Add standard additional articles
  yPosition = addAdditionalArticles(doc, margin, yPosition);
  
  // Add signature section
  const city = company?.city || 'Paris'; 
  yPosition = addSignatureSection(doc, city, margin, yPosition);
  
  // Add page footers with legal mentions and page numbers
  addPageFooter(doc);
  
  // Generate file name
  const fileName = `contrat_${contractData.type}_${contractData.employeeName.replace(/\s+/g, '_')}.pdf`;
  
  // Return PDF data
  return {
    fileName,
    pdfData: doc.output('blob'),
    pdfBase64: doc.output('datauristring')
  };
};

// Export the saveContractAsDocument function
export { saveContractAsDocument };
