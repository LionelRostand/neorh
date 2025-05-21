
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
        // Chercher le document associé au contrat
        const params = [
          { field: 'contractId', operator: '==', value: contractId },
          { field: 'category', operator: '==', value: 'contracts' }
        ];
        
        const result = await documentsCollection.getWhere(params);
        if (result.docs && result.docs.length > 0) {
          setDocument(result.docs[0]);
        } else {
          setError("Aucun document trouvé pour ce contrat.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du document:", err);
        setError("Erreur lors du chargement du contrat.");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger le document du contrat."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContractDocument();
  }, [contractId, open, documentsCollection]);

  const handleDownload = () => {
    if (!document?.fileUrl) return;
    
    try {
      // Convertir la base64 en Blob
      const byteCharacters = atob(document.fileUrl.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      // Créer un URL pour le blob et télécharger
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${document.title || 'contrat'}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Erreur lors du téléchargement:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de télécharger le document."
      });
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
            <iframe 
              src={document.fileUrl}
              className="w-full h-full border rounded-md"
              title="Contract PDF"
            />
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

export default ViewContractDialog;
