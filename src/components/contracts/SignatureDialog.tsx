
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Signature, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Document } from "@/lib/constants";
import useFirestore from "@/hooks/useFirestore";
import { updateContractWithSignatures } from "@/utils/pdf/contract/documentStorage";

interface SignatureDialogProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  isEmployer?: boolean;
}

export default function SignatureDialog({
  document,
  open,
  onOpenChange,
  onSuccess,
  isEmployer = false
}: SignatureDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureComplete, setSignatureComplete] = useState(false);
  const documentsCollection = useFirestore<Document>("hr_documents");
  const contractsCollection = useFirestore("hr_contracts");
  
  const handleSignature = async () => {
    if (!document?.id) return;
    
    try {
      setIsSubmitting(true);
      
      // Date de la signature
      const signatureDate = new Date().toISOString();
      
      // Mettre à jour le document avec la signature
      await documentsCollection.update(document.id, {
        ...(isEmployer 
          ? { 
              signedByEmployer: true,
              employerSignatureDate: signatureDate
            }
          : { 
              signedByEmployee: true,
              employeeSignatureDate: signatureDate
            })
      });
      
      // Si le document est lié à un contrat, mettre à jour également le contrat
      if (document.contractId) {
        await contractsCollection.update(document.contractId, {
          ...(isEmployer 
            ? { 
                signedByEmployer: true,
                employerSignatureDate: signatureDate
              }
            : { 
                signedByEmployee: true,
                employeeSignatureDate: signatureDate
              })
        });
        
        // Vérifier si les deux parties ont signé
        const result = await documentsCollection.getById(document.id);
        
        // Si les deux ont signé, mettre à jour le statut
        if (result.docs && result.docs.length > 0) {
          const updatedDoc = result.docs[0];
          if (updatedDoc.signedByEmployee && updatedDoc.signedByEmployer) {
            await documentsCollection.update(document.id, { status: 'active' });
            if (document.contractId) {
              await contractsCollection.update(document.contractId, { status: 'active' });
              
              // Mettre à jour le PDF avec les signatures
              await updateContractWithSignatures(
                document.contractId,
                true,
                true,
                updatedDoc.employeeSignatureDate || '',
                updatedDoc.employerSignatureDate || ''
              );
              
              toast({
                title: "Contrat activé",
                description: "Le contrat est maintenant actif et disponible dans le profil de l'employé",
                variant: "default"
              });
            }
          }
        }
      }
      
      setSignatureComplete(true);
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onOpenChange(false);
        setSignatureComplete(false);
      }, 1500);
      
    } catch (error) {
      console.error("Erreur lors de la signature:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la signature",
        variant: "destructive"
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const signerType = isEmployer ? "employeur" : "employé";
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {!signatureComplete ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Signature du document</DialogTitle>
              <DialogDescription>
                Vous êtes sur le point de signer électroniquement ce document en tant que <strong>{signerType}</strong>.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-6 space-y-4">
              <div className="flex items-center justify-center p-6 border rounded-md bg-gray-50">
                <Signature className="h-20 w-20 text-blue-600" />
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <p>
                  En cliquant sur "Signer le document", vous reconnaissez avoir lu et 
                  approuvé l'intégralité du contenu de ce document.
                </p>
              </div>
              
              <Separator />
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium">Document: {document?.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Cette signature électronique a la même valeur légale qu'une signature manuscrite.
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleSignature} 
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting ? "En cours..." : "Signer le document"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center">
            <CheckCircle className="h-16 w-16 text-emerald-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Signature réussie !</h2>
            <p className="text-center text-gray-500">
              Le document a été signé avec succès en tant que {signerType}.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
