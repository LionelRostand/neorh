import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Document } from "@/lib/constants";
import { FileIcon, Signature, Download, Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import useFirestore from "@/hooks/useFirestore";

interface DocumentCardProps {
  document: Document;
  onRefresh?: () => void;
}

const DocumentCard = ({ document, onRefresh }: DocumentCardProps) => {
  const [viewOpen, setViewOpen] = useState(false);
  const [signOpen, setSignOpen] = useState(false);
  const firestore = useFirestore<Document>("hr_documents");

  const handleDownload = () => {
    if (!document.fileUrl) {
      toast({
        title: "Erreur",
        description: "Aucun fichier disponible pour ce document",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create an anchor element and set the href to the document's file URL
      const link = window.document.createElement("a");
      link.href = document.fileUrl;
      link.download = `${document.title}.pdf`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } catch (error) {
      console.error("Erreur téléchargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document",
        variant: "destructive",
      });
    }
  };

  const handleView = () => {
    setViewOpen(true);
  };
  
  const handleSignatureRequest = async (type: 'employee' | 'employer') => {
    try {
      // Update the document with the new signature status
      await firestore.update(document.id!, {
        ...(type === 'employer' ? { signedByEmployer: true } : {}),
        ...(type === 'employee' ? { signedByEmployee: true } : {}),
        status: document.signedByEmployee || type === 'employee' ? 
               (document.signedByEmployer || type === 'employer' ? 'active' : 'pending_signature') :
               'pending_signature'
      });
      
      toast({
        title: "Document signé",
        description: type === 'employer' ? 
          "Le document a été signé par l'employeur" : 
          "Le document a été signé par l'employé",
      });
      
      setSignOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Erreur lors de la signature:", error);
      toast({
        title: "Erreur",
        description: "Impossible de signer le document",
        variant: "destructive",
      });
    }
  };

  const getDocumentIcon = () => {
    switch (document.fileType) {
      case "application/pdf":
        return <FileIcon className="h-10 w-10 text-red-500" />;
      case "image/jpeg":
      case "image/png":
        return <FileIcon className="h-10 w-10 text-blue-500" />;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <FileIcon className="h-10 w-10 text-blue-700" />;
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return <FileIcon className="h-10 w-10 text-green-600" />;
      default:
        return <FileIcon className="h-10 w-10 text-gray-500" />;
    }
  };
  
  const getStatusBadge = () => {
    if (document.category === 'contracts') {
      if (document.signedByEmployee && document.signedByEmployer) {
        return <Badge variant="default" className="bg-green-500">Signé</Badge>;
      } else if (document.signedByEmployee || document.signedByEmployer) {
        return <Badge variant="default" className="bg-orange-400">Signature partielle</Badge>;
      } else {
        return <Badge variant="outline" className="text-gray-500">Non signé</Badge>;
      }
    }
    
    switch (document.status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Actif</Badge>;
      case "expired":
        return <Badge variant="default" className="bg-red-500">Expiré</Badge>;
      case "pending":
      case "pending_signature":
        return <Badge variant="default" className="bg-yellow-500">En attente</Badge>;
      case "draft":
        return <Badge variant="outline">Brouillon</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };
  
  const getCategoryBadge = () => {
    switch (document.category) {
      case "contracts":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Contrat</Badge>;
      case "paystubs":
        return <Badge variant="outline" className="border-green-500 text-green-500">Fiche de paie</Badge>;
      case "certificates":
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Certificat</Badge>;
      case "id_documents":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pièce d'identité</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Autre</Badge>;
    }
  };

  const getFormattedDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    } catch (e) {
      return 'Date inconnue';
    }
  };

  const needsSignature = document.category === 'contracts' && (!document.signedByEmployee || !document.signedByEmployer);

  return (
    <>
      <Card className="overflow-hidden h-full flex flex-col">
        <CardContent className="pt-6 flex-grow">
          <div className="flex items-start gap-3 mb-3">
            {getDocumentIcon()}
            <div>
              <h3 className="font-medium text-sm line-clamp-2">{document.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {document.employeeName && `${document.employeeName} • `}
                {getFormattedDate(document.uploadDate)}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap mt-3 mb-2">
            {getStatusBadge()}
            {getCategoryBadge()}
          </div>
          
          {document.description && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{document.description}</p>
          )}
          
          {document.category === 'contracts' && (
            <div className="mt-3">
              <p className="text-xs">
                <span className={document.signedByEmployer ? "text-green-500" : "text-gray-500"}>
                  Employeur: {document.signedByEmployer ? "Signé" : "Non signé"}
                </span>
              </p>
              <p className="text-xs">
                <span className={document.signedByEmployee ? "text-green-500" : "text-gray-500"}>
                  Employé: {document.signedByEmployee ? "Signé" : "Non signé"}
                </span>
              </p>
            </div>
          )}
        </CardContent>
        
        <Separator />
        
        <CardFooter className="p-2 flex justify-between">
          <div className="flex gap-1">
            <Button onClick={handleView} size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>
            <Button onClick={handleDownload} size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          
          {needsSignature && (
            <Button 
              onClick={() => setSignOpen(true)} 
              size="sm" 
              variant="outline" 
              className="h-8 text-xs"
            >
              <Signature className="h-3 w-3 mr-1" />
              Signer
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Dialog pour la visualisation du PDF */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{document.title}</DialogTitle>
          </DialogHeader>
          <div className="h-[70vh] overflow-auto">
            <iframe 
              src={document.fileUrl} 
              className="w-full h-full border-0" 
              title={document.title}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour la signature */}
      <Dialog open={signOpen} onOpenChange={setSignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Signature du document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p>Veuillez sélectionner votre rôle pour signer ce document :</p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {!document.signedByEmployer && (
              <Button onClick={() => handleSignatureRequest('employer')}>
                <Signature className="mr-2 h-4 w-4" />
                Signer en tant qu'employeur
              </Button>
            )}
            {!document.signedByEmployee && (
              <Button onClick={() => handleSignatureRequest('employee')} variant="outline">
                <Signature className="mr-2 h-4 w-4" />
                Signer en tant qu'employé
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentCard;
