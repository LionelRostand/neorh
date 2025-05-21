
import React from "react";
import { Document } from "@/lib/constants";
import { isBase64Data } from "@/utils/contracts/documentDownload";

interface DocumentViewerProps {
  document: Document | null;
  loading: boolean;
  error: string | null;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, loading, error }) => {
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Chargement du contrat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!document?.fileUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Aucun document disponible pour ce contrat.</p>
      </div>
    );
  }

  // Afficher le PDF selon son format (base64 ou URL)
  if (isBase64Data(document.fileUrl)) {
    return (
      <iframe 
        src={document.fileUrl}
        className="w-full h-full border rounded-md"
        title="Contract PDF"
      />
    );
  } 
  
  return (
    <object 
      data={document.fileUrl}
      type="application/pdf" 
      className="w-full h-full border rounded-md"
    >
      <p>Le navigateur ne peut pas afficher ce PDF. <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">Ouvrir le PDF</a></p>
    </object>
  );
};

export default DocumentViewer;
