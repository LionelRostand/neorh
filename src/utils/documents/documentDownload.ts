
import { Document } from "@/lib/constants";
import { toast } from "@/components/ui/use-toast";

/**
 * Handles document download from URL or base64 data
 */
export const handleDocumentDownload = (document: Document): void => {
  if (!document.fileUrl) return;
  
  // Convert base64 to blob
  if (document.fileUrl.startsWith('data:')) {
    const base64Response = fetch(document.fileUrl);
    base64Response.then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = document.title
          .replace(/\s+/g, '_')
          .toLowerCase() + '.pdf';
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
  } else {
    window.open(document.fileUrl, '_blank');
  }
};
