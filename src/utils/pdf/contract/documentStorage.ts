
import { firestore } from 'firebase/app';
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
      name: `Contrat ${contractData.type} - ${contractData.employeeName}`,
      description: `Contrat de travail ${contractData.type} pour ${contractData.employeeName}`,
      employeeId: contractData.employeeId,
      contractId: contractData.id,
      departmentId: contractData.departmentId,
      fileType: 'pdf',
      category: 'contracts',
      file: {
        name: pdfResult.fileName,
        base64: pdfResult.pdfBase64,
        type: 'application/pdf'
      },
      uploadDate: new Date().toISOString(),
      status: 'active',
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
