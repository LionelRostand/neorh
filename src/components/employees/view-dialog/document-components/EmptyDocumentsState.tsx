
import React from 'react';
import { FileText } from 'lucide-react';

const EmptyDocumentsState: React.FC = () => {
  return (
    <div className="text-center py-10 border rounded-lg">
      <FileText className="mx-auto h-12 w-12 text-gray-300" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun document</h3>
      <p className="mt-1 text-sm text-gray-500">
        Cet employé n'a aucun document associé.
      </p>
    </div>
  );
};

export default EmptyDocumentsState;
