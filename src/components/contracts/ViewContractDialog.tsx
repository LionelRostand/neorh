
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import DocumentDialogHeader from "./document-display/DocumentDialogHeader";
import DocumentViewer from "./document-display/DocumentViewer";
import { useContractDocument } from "@/hooks/contracts/useContractDocument";

interface ViewContractDialogProps {
  open: boolean;
  onClose: () => void;
  contractId: string | null;
}

const ViewContractDialog = ({
  open,
  onClose,
  contractId,
}: ViewContractDialogProps) => {
  const { document, loading, error } = useContractDocument(contractId, open);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  
  // Ajouter un timeout pour éviter le chargement infini
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (open && contractId) {
      setHasTimedOut(false);
      timeoutId = setTimeout(() => {
        if (loading && !document) {
          console.log("Fallback de sécurité activé après timeout");
          setHasTimedOut(true);
        }
      }, 8000); // Fallback après 8 secondes
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [open, contractId, loading, document]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col p-0">
        <DocumentDialogHeader 
          document={document} 
          onClose={onClose} 
        />
        
        <div className="flex-1 overflow-hidden">
          <DocumentViewer 
            document={document}
            loading={loading && !hasTimedOut}
            error={hasTimedOut ? "Le chargement du document a pris trop de temps. Affichage d'un exemple." : error}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewContractDialog;
