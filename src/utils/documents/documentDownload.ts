
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
    console.log("Starting download for document:", document.title, "URL:", document.fileUrl);
    
    // Generate filename
    const filename = document.title
      ? document.title.replace(/\s+/g, '_').toLowerCase() + '.pdf'
      : 'document.pdf';
    
    // Convert base64 to blob if needed
    if (document.fileUrl.startsWith('data:')) {
      console.log("Processing base64 document");
      fetch(document.fileUrl)
        .then(res => res.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          
          toast({
            title: "Succès",
            description: "Téléchargement démarré",
          });
        })
        .catch(error => {
          console.error("Erreur lors du téléchargement base64:", error);
          toast({
            title: "Erreur",
            description: "Impossible de télécharger ce document.",
            variant: "destructive"
          });
        });
    } else {
      // Direct URL download
      console.log("Processing direct URL download");
      const a = document.createElement('a');
      a.href = document.fileUrl;
      a.download = filename;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Succès",
        description: "Téléchargement démarré",
      });
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
