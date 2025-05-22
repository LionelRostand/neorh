
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ContractData, PdfResult } from '../types/contractTypes';
import { toast } from '@/components/ui/use-toast';

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
