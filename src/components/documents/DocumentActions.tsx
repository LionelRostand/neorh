
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import { Document } from '@/lib/constants';
import { needsSignature } from '@/utils/documents/documentUtils';

interface DocumentActionsProps {
  document: Document;
  onDownload: () => void;
  onDelete: () => void;
  onSignEmployee: () => void;
  onSignEmployer: () => void;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  document,
  onDownload,
  onDelete,
  onSignEmployee,
  onSignEmployer
}) => {
  const needsSigning = needsSignature(document);
  
  return (
    <div className="border-t pt-4 pb-4 flex flex-wrap gap-2 justify-between">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={onDownload}
        >
          <Download className="h-3.5 w-3.5" />
          <span>Télécharger</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-red-500 text-red-600 hover:bg-red-50"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Supprimer</span>
        </Button>
      </div>
      
      <div className="flex gap-2">
        {needsSigning && !document.signedByEmployee && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSignEmployee}
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            Signer (employé)
          </Button>
        )}
        
        {needsSigning && !document.signedByEmployer && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSignEmployer}
            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
          >
            Signer (employeur)
          </Button>
        )}
      </div>
    </div>
  );
};

export default DocumentActions;
