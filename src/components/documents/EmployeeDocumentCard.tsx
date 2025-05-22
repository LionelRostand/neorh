
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Document } from "@/lib/constants";
import { FileText, Download, Check, X, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import SignatureDialog from "../contracts/SignatureDialog";
import DeleteDocumentDialog from "./DeleteDocumentDialog";
import { toast } from "@/components/ui/use-toast";
import useFirestore from "@/hooks/useFirestore";

interface DocumentCardProps {
  document: Document;
  onRefresh?: () => void;
}

const DocumentCard = ({ document, onRefresh }: DocumentCardProps) => {
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [isEmployerSigning, setIsEmployerSigning] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Firestore hook pour la suppression de documents
  const documentCollection = useFirestore<Document>("hr_documents");
  
  const handleDownload = () => {
    if (!document.fileUrl) return;
    
    // Convert base64 to blob
    if (document.fileUrl.startsWith('data:')) {
      const base64Response = fetch(document.fileUrl);
      base64Response.then(res => res.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = window.document.createElement('a');
          a.href = url;
          a.download = document.title
            .replace(/\s+/g, '_')
            .toLowerCase() + '.pdf';
          window.document.body.appendChild(a);
          a.click();
          window.document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        });
    } else {
      window.open(document.fileUrl, '_blank');
    }
  };
  
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
      // Rafraîchir la liste des documents
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
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'pending': return 'En attente';
      case 'pending_signature': return 'En attente de signatures';
      case 'expired': return 'Expiré';
      case 'draft': return 'Brouillon';
      default: return 'Non défini';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending':
      case 'pending_signature': return 'bg-amber-100 text-amber-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const needsSignature = document.category === 'contracts' && 
                         (document.status === 'pending_signature' || 
                          document.status === 'pending');
  
  const openSignatureDialog = (isEmployer: boolean) => {
    setIsEmployerSigning(isEmployer);
    setSignDialogOpen(true);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch {
      return 'Date inconnue';
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-gray-100 rounded">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="font-medium">{document.title}</h3>
            </div>
            <Badge className={getStatusColor(document.status || 'pending')}>
              {getStatusLabel(document.status || 'pending')}
            </Badge>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>{document.description || 'Contrat de travail'}</p>
            <p className="text-xs mt-1">
              Ajouté le {formatDate(document.uploadDate)}
            </p>
          </div>
        </div>
        
        {needsSignature && (
          <div className="bg-gray-50 p-4 border-t border-b">
            <h4 className="text-sm font-medium mb-2">Signatures</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Signature employé</span>
                <div className="flex items-center">
                  {document.signedByEmployee ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Signé
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                      <X className="h-3 w-3" /> Non signé
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Signature employeur</span>
                <div className="flex items-center">
                  {document.signedByEmployer ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Signé
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                      <X className="h-3 w-3" /> Non signé
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t bg-gray-50 p-3 flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-xs bg-white"
            onClick={handleDownload}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Télécharger</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs border-red-500 text-red-600 hover:bg-red-50 bg-white"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Supprimer</span>
          </Button>
        </div>
        
        {needsSignature && (
          <div className="flex gap-2">
            {!document.signedByEmployee && (
              <Button
                size="sm"
                onClick={() => openSignatureDialog(false)}
                className="bg-blue-600 hover:bg-blue-700 text-xs"
              >
                Signer (employé)
              </Button>
            )}
            
            {!document.signedByEmployer && (
              <Button
                size="sm"
                onClick={() => openSignatureDialog(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-xs"
              >
                Signer (employeur)
              </Button>
            )}
          </div>
        )}
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
