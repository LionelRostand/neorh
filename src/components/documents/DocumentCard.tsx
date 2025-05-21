
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Document } from "@/lib/constants";
import { FileText, Download, Check, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import SignatureDialog from "../contracts/SignatureDialog";

interface DocumentCardProps {
  document: Document;
  onRefresh?: () => void;
}

const DocumentCard = ({ document, onRefresh }: DocumentCardProps) => {
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [isEmployerSigning, setIsEmployerSigning] = useState(false);
  
  const handleDownload = () => {
    if (!document.fileUrl) return;
    
    // Convert base64 to blob
    if (document.fileUrl.startsWith('data:')) {
      const base64Response = fetch(document.fileUrl);
      base64Response.then(res => res.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = document.title
            .replace(/\s+/g, '_')
            .toLowerCase() + '.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
        });
    } else {
      window.open(document.fileUrl, '_blank');
    }
  };
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'contracts': return 'Contrat';
      case 'paystubs': return 'Bulletin de paie';
      case 'certificates': return 'Certificat';
      default: return 'Document';
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
  
  const needsSignature = document.category === 'contracts' && 
                         (document.status === 'pending_signature' || 
                          document.status === 'pending');
  
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
            Ajouté le {format(new Date(document.uploadDate), 'dd MMMM yyyy', { locale: fr })}
          </p>
        </div>
        
        {needsSignature && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center text-sm">
              <div className="w-1/2">Signature employé:</div>
              <div className="w-1/2 flex">
                {document.signedByEmployee ? 
                  <Check className="h-4 w-4 text-green-600" /> : 
                  <X className="h-4 w-4 text-red-600" />
                }
              </div>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-1/2">Signature employeur:</div>
              <div className="w-1/2 flex">
                {document.signedByEmployer ? 
                  <Check className="h-4 w-4 text-green-600" /> : 
                  <X className="h-4 w-4 text-red-600" />
                }
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4 pb-4 flex flex-wrap gap-2 justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={handleDownload}
        >
          <Download className="h-3.5 w-3.5" />
          <span>Télécharger</span>
        </Button>
        
        {needsSignature && !document.signedByEmployee && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openSignatureDialog(false)}
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            Signer (employé)
          </Button>
        )}
        
        {needsSignature && !document.signedByEmployer && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openSignatureDialog(true)}
            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
          >
            Signer (employeur)
          </Button>
        )}
      </CardFooter>
      
      <SignatureDialog
        document={document}
        open={signDialogOpen}
        onOpenChange={setSignDialogOpen}
        onSuccess={onRefresh}
        isEmployer={isEmployerSigning}
      />
    </Card>
  );
};

export default DocumentCard;
