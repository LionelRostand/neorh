
import React from 'react';
import { Document } from '@/lib/constants';
import DocumentCard from '@/components/documents/EmployeeDocumentCard';

interface DocumentsGridProps {
  documents: Document[];
  onRefresh: () => void;
}

const DocumentsGrid: React.FC<DocumentsGridProps> = ({ documents, onRefresh }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
};

export default DocumentsGrid;
