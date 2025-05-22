
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const DocumentsHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-semibold">Documents</h3>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1 bg-white border-emerald-600 text-emerald-600 hover:bg-emerald-50"
      >
        <Plus className="h-4 w-4" />
        Ajouter un document
      </Button>
    </div>
  );
};

export default DocumentsHeader;
