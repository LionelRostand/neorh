
import React from 'react';
import { Check, X } from 'lucide-react';
import { Document } from '@/lib/constants';

interface DocumentSignatureStatusProps {
  document: Document;
}

const DocumentSignatureStatus: React.FC<DocumentSignatureStatusProps> = ({ document }) => {
  if (document.category !== 'contracts' || 
     (document.status !== 'pending_signature' && document.status !== 'pending')) {
    return null;
  }

  return (
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
  );
};

export default DocumentSignatureStatus;
