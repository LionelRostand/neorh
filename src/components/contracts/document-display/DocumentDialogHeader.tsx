
import React from "react";
import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, X, Printer } from "lucide-react";
import { Document } from "@/lib/constants";
import { downloadDocument } from "@/utils/contracts/documentDownload";

interface DocumentDialogHeaderProps {
  document: Document | null;
  onClose: () => void;
}

const DocumentDialogHeader: React.FC<DocumentDialogHeaderProps> = ({ document, onClose }) => {
  const handleDownload = () => {
    downloadDocument(document);
  };
  
  const handlePrint = () => {
    window.print();
  };

  // Titre spécifique pour le contrat de Lionel DJOSSA
  const title = document?.employeeName === "Lionel DJOSSA" 
    ? "Contrat CDI - Lionel DJOSSA" 
    : (document?.title || "Contrat de travail");

  return (
    <DialogHeader className="px-6 pt-6 pb-2 flex flex-row justify-between items-center border-b">
      <DialogTitle className="text-xl flex items-center gap-2">
        <FileText className="h-5 w-5" />
        {title}
      </DialogTitle>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4 mr-2" /> Imprimer
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload}
          disabled={!document?.fileUrl}
        >
          <Download className="h-4 w-4 mr-2" /> Télécharger
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </DialogHeader>
  );
};

export default DocumentDialogHeader;
