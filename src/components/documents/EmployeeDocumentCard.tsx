
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Document } from "@/lib/constants";
import { FileText, Download, Check, X } from "lucide-react";
import SignatureDialog from "../contracts/SignatureDialog";
import { downloadDocument } from "@/utils/contracts/documentDownload";
import { 
  formatUploadDate,
  getStatusColor,
  getStatusLabel,
  getCategoryLabel,
  needsSignature
} from "@/utils/documents/documentUtils";

interface EmployeeDocumentCardProps {
  document: Document;
  onRefresh?: () => void;
}

const EmployeeDocumentCard = ({ document, onRefresh }: EmployeeDocumentCardProps) => {
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [isEmployerSigning, setIsEmployerSigning] = useState(false);
  
  const openSignatureDialog = (isEmployer: boolean) => {
    setIsEmployerSigning(isEmployer);
    setSignDialogOpen(true);
  };
  
  const documentNeedsSignature = needsSignature(document);
  
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
            Ajouté le {formatUploadDate(document.uploadDate)}
          </p>
        </div>
        
        {documentNeedsSignature && (
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
          {documentNeedsSignature && !document.signedByEmployee && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => openSignatureDialog(false)}
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              Signer (employé)
            </Button>
          )}
          
          {documentNeedsSignature && !document.signedByEmployer && (
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
