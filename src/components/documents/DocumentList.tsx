
import React from "react";
import DocumentCard from "./DocumentCard";
import { Document } from "@/lib/constants";

interface DocumentListProps {
  documents: Document[];
}

const DocumentList = ({ documents }: DocumentListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
      {documents.length === 0 && (
        <div className="col-span-full text-center py-10 text-gray-500">
          Aucun document trouvé
        </div>
      )}
    </div>
  );
};

export default DocumentList;
