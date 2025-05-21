
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Signature } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Document } from "@/lib/constants";
import useFirestore from "@/hooks/useFirestore";

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
  const documentsCollection = useFirestore<Document>("hr_documents");
  const contractsCollection = useFirestore("hr_contracts");
  
  const handleSignature = async () => {
    if (!document?.id) return;
    
    try {
      setIsSubmitting(true);
      
      // Mettre à jour le document
      await documentsCollection.update(document.id, {
        ...(isEmployer 
          ? { signedByEmployer: true }
          : { signedByEmployee: true })
      });
      
      // Si le document est lié à un contrat, mettre à jour également le contrat
      if (document.contractId) {
        await contractsCollection.update(document.contractId, {
          ...(isEmployer 
            ? { signedByEmployer: true }
            : { signedByEmployee: true })
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
            }
          }
        }
      }
      
      toast({
        title: "Signature effectuée",
        description: "Le document a été signé avec succès",
      });
      
      if (onSuccess) onSuccess();
      onOpenChange(false);
      
    } catch (error) {
      console.error("Erreur lors de la signature:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la signature",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const signerType = isEmployer ? "employeur" : "employé";
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Signature du document</DialogTitle>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          <p>
            Vous êtes sur le point de signer électroniquement ce document en tant que <strong>{signerType}</strong>.
          </p>
          
          <p>
            En cliquant sur "Signer le document", vous reconnaissez avoir lu et approuvé l'intégralité de son contenu.
          </p>
          
          <div className="flex items-center justify-center p-4 border rounded-md">
            <Signature className="h-16 w-16 text-blue-500" />
          </div>
          
          <Separator />
          
          <p className="text-sm text-gray-500">
            Document: {document?.title}
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button 
            onClick={handleSignature} 
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isSubmitting ? "En cours..." : "Signer le document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
