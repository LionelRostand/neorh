
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
  // Ajouter un timeout pour éviter le chargement infini
  const [showLoading, setShowLoading] = React.useState(true);
  
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (loading) {
      // Montrer l'état de chargement pendant 5 secondes max
      timeoutId = setTimeout(() => {
        setShowLoading(false);
      }, 5000);
    } else {
      setShowLoading(loading);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading]);

  if (loading && showLoading) {
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
