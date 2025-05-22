
import React from "react";
import { Document } from "@/lib/constants";
import MockContract from "./content/MockContract";
import PdfViewer from "./content/PdfViewer";
import LoadingState from "./states/LoadingState";
import ErrorState from "./states/ErrorState";

interface DocumentViewerProps {
  document: Document | null;
  loading: boolean;
  error: string | null;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, loading, error }) => {
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!document?.fileUrl) {
    // Si aucun document n'est disponible, on affiche un exemple de contrat basé sur les captures
    return <MockContract />;
  }

  // Afficher le PDF selon son format (base64 ou URL)
  return <PdfViewer fileUrl={document.fileUrl} />;
};

export default DocumentViewer;
