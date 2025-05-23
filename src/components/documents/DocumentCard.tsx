
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Document } from "@/lib/constants";
import { FileText } from "lucide-react";
import useFirestore from "@/hooks/useFirestore";
import { toast } from "@/components/ui/use-toast";
import SignatureDialog from "../contracts/SignatureDialog";
import DeleteDocumentDialog from "./DeleteDocumentDialog";
import DocumentSignatureStatus from "./DocumentSignatureStatus";
import DocumentActions from "./DocumentActions";
import { 
  formatUploadDate,
  getStatusColor,
  getStatusLabel,
  getCategoryLabel
} from "@/utils/documents/documentUtils";
import { handleDocumentDownload } from "@/utils/documents/documentDownload";

interface DocumentCardProps {
  document: Document;
  onRefresh?: () => void;
}

const DocumentCard = ({ document, onRefresh }: DocumentCardProps) => {
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [isEmployerSigning, setIsEmployerSigning] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Firestore hook for document deletion
  const documentCollection = useFirestore<Document>("hr_documents");
  
  const handleDelete = async () => {
    if (!document.id) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer ce document car il n'a pas d'identifiant valide.",
        variant: "destructive"
      });
      return;
    }

    try {
      await documentCollection.remove(document.id);
      toast({
        title: "Succès",
        description: "Document supprimé avec succès",
      });
      // Refresh document list
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression du document.",
        variant: "destructive"
      });
    }
  };
  
  const openSignatureDialog = (isEmployer: boolean) => {
    setIsEmployerSigning(isEmployer);
    setSignDialogOpen(true);
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            <h3 className="font-medium line-clamp-1">{document.title}</h3>
          </div>
          <Badge className={getStatusColor(document.status || 'pending')}>
            {getStatusLabel(document.status || 'pending')}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-500">
            {document.description || getCategoryLabel(document.category || 'other')}
          </p>
          <p className="text-xs text-gray-500">
            Ajouté le {formatUploadDate(document.uploadDate)}
          </p>
        </div>
        
        <DocumentSignatureStatus document={document} />
      </CardContent>
      
      <CardFooter>
        <DocumentActions 
          document={document}
          onDownload={() => handleDocumentDownload(document)}
          onDelete={() => setDeleteDialogOpen(true)}
          onSignEmployee={() => openSignatureDialog(false)}
          onSignEmployer={() => openSignatureDialog(true)}
        />
      </CardFooter>
      
      <SignatureDialog
        document={document}
        open={signDialogOpen}
        onOpenChange={setSignDialogOpen}
        onSuccess={onRefresh}
        isEmployer={isEmployerSigning}
      />
      
      <DeleteDocumentDialog
        documentId={document.id || null}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </Card>
  );
};

export default DocumentCard;
