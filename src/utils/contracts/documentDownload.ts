
import { showErrorToast } from "@/utils/toastUtils";
import { Document } from "@/lib/constants";

/**
 * Utility to handle document downloads
 */
export const downloadDocument = (document: Document | null) => {
  if (!document?.fileUrl) return;
  
  try {
    // Vérifier si fileUrl est une URL ou une chaîne base64
    const isBase64 = document.fileUrl.startsWith('data:');
    
    if (isBase64) {
      // Traitement pour base64
      const byteCharacters = atob(document.fileUrl.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      // Créer un URL pour le blob et télécharger
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${document.title || 'contrat'}.pdf`);
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } else {
      // Traitement pour URL directe
      const link = window.document.createElement('a');
      link.href = document.fileUrl;
      link.setAttribute('download', `${document.title || 'contrat'}.pdf`);
      link.setAttribute('target', '_blank');
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  } catch (err) {
    console.error("Erreur lors du téléchargement:", err);
    showErrorToast("Impossible de télécharger le document.");
  }
};

/**
 * Check if a string is base64 data
 */
export const isBase64Data = (str: string): boolean => {
  return str.startsWith('data:');
};
