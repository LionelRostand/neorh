
import React from 'react';
import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyDocumentsStateProps {
  onAddDocument?: () => void;
}

const EmptyDocumentsState: React.FC<EmptyDocumentsStateProps> = ({ onAddDocument }) => {
  return (
    <div className="text-center py-10 border rounded-lg bg-gray-50">
      <FileText className="mx-auto h-12 w-12 text-gray-300" />
      <h3 className="mt-4 text-sm font-semibold text-gray-900">Aucun document</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
        Cet employé n'a aucun document associé à son profil. Vous pouvez ajouter des documents comme des contrats, fiches de paie ou certificats.
      </p>
      {onAddDocument && (
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4 flex items-center gap-1 bg-white border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          onClick={onAddDocument}
        >
          <Upload className="h-4 w-4" />
          Ajouter un document
        </Button>
      )}
    </div>
  );
};

export default EmptyDocumentsState;
