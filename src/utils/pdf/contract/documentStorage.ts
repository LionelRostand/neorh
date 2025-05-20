
import { ContractData, PdfResult } from '../types/contractTypes';
import { Document } from '@/lib/constants';

/**
 * Saves the contract as a document in Firestore
 */
export const saveContractAsDocument = async (
  contractData: ContractData,
  pdfData: PdfResult,
  firestore: any
): Promise<Document> => {
  try {
    // Create document object for hr_documents collection
    const document: Document = {
      id: contractData.id || Date.now().toString(),
      title: `Contrat ${contractData.type} - ${contractData.employeeName}`,
      category: 'contracts',
      fileUrl: pdfData.pdfBase64,
      fileType: 'application/pdf',
      uploadDate: new Date().toISOString(),
      status: contractData.status || 'pending_signature',
      employeeId: contractData.employeeId,
      employeeName: contractData.employeeName,
      contractId: contractData.id,
      description: `Contrat de travail ${contractData.type} pour ${contractData.position}`,
      signedByEmployee: false,
      signedByEmployer: false,
    };
    
    // Save the document
    await firestore.add(document);
    
    return document;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du document de contrat:', error);
    throw error;
  }
};
