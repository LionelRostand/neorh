
import { Document } from "@/lib/constants";
import { toast } from "@/components/ui/use-toast";

/**
 * Handles document download from URL or base64 data
 */
export const handleDocumentDownload = (document: Document): void => {
  if (!document?.fileUrl) {
    toast({
      title: "Erreur",
      description: "Impossible de télécharger ce document. URL manquante.",
      variant: "destructive"
    });
    return;
  }
  
  try {
    // Convert base64 to blob
    if (document.fileUrl.startsWith('data:')) {
      const base64Response = fetch(document.fileUrl);
      base64Response.then(res => res.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = window.document.createElement('a');
          a.href = url;
          a.download = document.title
            ? document.title.replace(/\s+/g, '_').toLowerCase() + '.pdf'
            : 'document.pdf';
          window.document.body.appendChild(a);
          a.click();
          window.document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          
          toast({
            title: "Succès",
            description: "Téléchargement démarré",
          });
        })
        .catch(error => {
          console.error("Erreur lors du téléchargement:", error);
          toast({
            title: "Erreur",
            description: "Impossible de télécharger ce document.",
            variant: "destructive"
          });
        });
    } else {
      // Direct URL download
      window.open(document.fileUrl, '_blank');
    }
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    toast({
      title: "Erreur",
      description: "Impossible de télécharger ce document.",
      variant: "destructive"
    });
  }
};

