
import React from "react";
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
            loading={loading}
            error={error}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewContractDialog;
