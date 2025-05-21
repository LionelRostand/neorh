
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, X } from "lucide-react";
import { Contract } from "@/lib/constants";
import useFirestore from "@/hooks/useFirestore";
import { Document } from "@/lib/constants";
import { toast } from "@/components/ui/use-toast";
import { SearchCriteria } from "@/hooks/firestore/searchOperations";
import { showErrorToast } from "@/utils/toastUtils";

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
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const documentsCollection = useFirestore<Document>("hr_documents");

  useEffect(() => {
    const fetchContractDocument = async () => {
      if (!contractId || !open) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching contract document for ID:", contractId);
        
        // Chercher le document associé au contrat en utilisant search
        const criteria: SearchCriteria = { 
          field: 'contractId', 
          value: contractId, 
          operator: '==' 
        };
        
        const result = await documentsCollection.search(criteria);
        console.log("Search result:", result);
        
        // Filtrer manuellement pour la catégorie 'contracts'
        const filteredDocs = result.docs.filter(doc => doc.category === 'contracts');
        console.log("Filtered docs:", filteredDocs);
        
        if (filteredDocs && filteredDocs.length > 0) {
          setDocument(filteredDocs[0]);
        } else {
          setError("Aucun document trouvé pour ce contrat.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du document:", err);
        setError("Erreur lors du chargement du contrat.");
        showErrorToast("Impossible de charger le document du contrat.");
      } finally {
        setLoading(false);
      }
    };

    fetchContractDocument();
  }, [contractId, open, documentsCollection]);

  const handleDownload = () => {
    if (!document?.fileUrl) return;
    
    try {
      // Vérifier si fileUrl est une URL ou une chaîne base64
      const isBase64 = document.fileUrl.startsWith('data:');
      
      if (isBase64) {
        // Traitement pour base64
        const byteCharacters = atob(document.fileUrl.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        
        // Créer un URL pour le blob et télécharger
        const url = window.URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${document.title || 'contrat'}.pdf`);
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
      } else {
        // Traitement pour URL directe
        const link = window.document.createElement('a');
        link.href = document.fileUrl;
        link.setAttribute('download', `${document.title || 'contrat'}.pdf`);
        link.setAttribute('target', '_blank');
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Erreur lors du téléchargement:", err);
      showErrorToast("Impossible de télécharger le document.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2 flex flex-row justify-between items-center">
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document?.title || "Contrat"}
          </DialogTitle>
          <div className="flex gap-2">
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
        
        <div className="flex-1 overflow-hidden p-6 pt-2">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <p>Chargement du contrat...</p>
            </div>
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : document?.fileUrl ? (
            isBase64Data(document.fileUrl) ? (
              <iframe 
                src={document.fileUrl}
                className="w-full h-full border rounded-md"
                title="Contract PDF"
              />
            ) : (
              <object 
                data={document.fileUrl}
                type="application/pdf" 
                className="w-full h-full border rounded-md"
              >
                <p>Le navigateur ne peut pas afficher ce PDF. <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">Ouvrir le PDF</a></p>
              </object>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p>Aucun document disponible pour ce contrat.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Fonction utilitaire pour vérifier si une chaîne est au format base64
const isBase64Data = (str: string): boolean => {
  return str.startsWith('data:');
};

export default ViewContractDialog;
