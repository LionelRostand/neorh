
import { addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ContractData, PdfResult } from '../types/contractTypes';
import { toast } from '@/components/ui/use-toast';
import { generateContractPdf } from '../generateContractPdf';
import useFirestore from '@/hooks/useFirestore';

/**
 * Sauvegarde le contrat en tant que document dans la base de données
 */
export const saveContractAsDocument = async (
  contractData: ContractData,
  pdfResult: PdfResult,
  documentsCollection: any
) => {
  try {
    console.log("Saving contract as document:", contractData.id);
    
    // Créer l'objet document
    const document = {
      title: `Contrat ${contractData.type} - ${contractData.employeeName}`,
      description: `Contrat de travail ${contractData.type} pour ${contractData.employeeName}`,
      employeeId: contractData.employeeId,
      employeeName: contractData.employeeName,
      contractId: contractData.id,
      departmentId: contractData.departmentId,
      fileType: 'pdf',
      category: 'contracts',
      fileUrl: pdfResult.pdfBase64,
      uploadDate: new Date().toISOString(),
      status: 'pending_signature',
      signedByEmployee: false,
      signedByEmployer: false,
      employeeSignatureDate: null,
      employerSignatureDate: null,
      tags: ['contrat', contractData.type.toLowerCase()]
    };
    
    // Ajouter à la collection documents
    const result = await documentsCollection.add(document);
    
    console.log("Document saved with ID:", result.id);
    
    return result;
  } catch (error) {
    console.error("Error saving contract as document:", error);
    toast({
      title: "Erreur",
      description: "Impossible de sauvegarder le contrat en tant que document",
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Met à jour le document PDF du contrat avec les signatures
 */
export const updateContractWithSignatures = async (
  contractId: string, 
  employeeSignature: boolean, 
  employerSignature: boolean,
  employeeSignatureDate: string = '',
  employerSignatureDate: string = ''
) => {
  try {
    console.log("Mise à jour du contrat avec signatures:", contractId);
    
    // Récupérer les données du contrat
    const contractsCollection = useFirestore("hr_contracts");
    const documentsCollection = useFirestore("hr_documents");
    
    // Récupérer le contrat
    const contractResult = await contractsCollection.getById(contractId);
    if (!contractResult.docs || contractResult.docs.length === 0) {
      throw new Error("Contrat introuvable");
    }
    
    const contractData = contractResult.docs[0] as ContractData;
    
    // Ajouter les informations de signature
    contractData.signedByEmployee = employeeSignature;
    contractData.signedByEmployer = employerSignature;
    contractData.employeeSignatureDate = employeeSignatureDate;
    contractData.employerSignatureDate = employerSignatureDate;
    
    // Régénérer le PDF avec les signatures
    const updatedPdf = generateContractPdf(contractData);
    
    // Trouver le document associé au contrat
    const documentResult = await documentsCollection.search({
      field: 'contractId',
      operator: '==',
      value: contractId
    });
    
    if (!documentResult.docs || documentResult.docs.length === 0) {
      throw new Error("Document associé au contrat introuvable");
    }
    
    // Mettre à jour le document avec le nouveau PDF
    const documentId = documentResult.docs[0].id;
    await documentsCollection.update(documentId, {
      fileUrl: updatedPdf.pdfBase64,
      status: 'active',
      signedByEmployee: employeeSignature,
      signedByEmployer: employerSignature,
      employeeSignatureDate: employeeSignatureDate,
      employerSignatureDate: employerSignatureDate
    });
    
    console.log("Document PDF mis à jour avec succès");
    
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du PDF avec signatures:", error);
    return { success: false, error };
  }
};
