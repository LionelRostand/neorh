
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Document } from "@/lib/constants";
import { FileText, Download, Check, X } from "lucide-react";
import { format, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import SignatureDialog from "../contracts/SignatureDialog";
import { downloadDocument } from "@/utils/contracts/documentDownload";

interface EmployeeDocumentCardProps {
  document: Document;
  onRefresh?: () => void;
}

const EmployeeDocumentCard = ({ document, onRefresh }: EmployeeDocumentCardProps) => {
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [isEmployerSigning, setIsEmployerSigning] = useState(false);
  
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
  
  // Fonction pour formater la date en toute sécurité
  const formatUploadDate = () => {
    try {
      if (!document.uploadDate) return "Date inconnue";
      
      // Vérifier si la date est déjà un objet Date
      const dateToFormat = typeof document.uploadDate === 'string' 
        ? new Date(document.uploadDate)
        : document.uploadDate;
      
      // Vérifier si la date est valide
      if (!isValid(dateToFormat)) {
        console.warn("Date invalide:", document.uploadDate);
        return "Date invalide";
      }
      
      return format(dateToFormat, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error("Erreur de formatage de date:", error, document.uploadDate);
      return "Date non disponible";
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            <h3 className="font-medium truncate">{document.title}</h3>
          </div>
          <Badge className={getStatusColor(document.status || 'pending')}>
            {getStatusLabel(document.status || 'pending')}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            {document.description || getCategoryLabel(document.category || 'other')}
          </p>
          <p className="text-xs text-gray-500">
            Ajouté le {formatUploadDate()}
          </p>
        </div>
        
        {needsSignature && (
          <div className="mt-4 space-y-2">
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
          onClick={() => downloadDocument(document)}
        >
          <Download className="h-3.5 w-3.5" />
          <span>Télécharger</span>
        </Button>
        
        <div className="flex gap-2">
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
        </div>
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

export default EmployeeDocumentCard;
