
import { useState, ChangeEvent } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useLogoUpload = () => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Format non supporté",
        description: "Seules les images sont acceptées",
        variant: "destructive"
      });
      return;
    }

    // Vérifier la taille du fichier (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "Le fichier ne doit pas dépasser 2MB",
        variant: "destructive"
      });
      return;
    }

    setLogoFile(file);

    // Créer une URL pour la prévisualisation
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const resetLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const uploadLogo = async () => {
    // Si pas de nouveau logo, on retourne null
    if (!logoFile) {
      console.log("useLogoUpload: No new logo file to upload");
      
      // Si on a un preview mais pas de file, c'est qu'on a gardé le logo existant
      if (logoPreview && logoPreview.startsWith('data:image')) {
        console.log("useLogoUpload: Keeping existing logo (base64)");
        return {
          base64: logoPreview,
          type: logoPreview.split(';')[0].split(':')[1],
          name: "existing-logo"
        };
      }
      
      return null;
    }

    try {
      console.log("useLogoUpload: Starting logo upload process");
      setIsUploading(true);

      // Convertir l'image en base64
      return new Promise<{ base64: string, type: string, name: string } | null>((resolve) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          console.log("useLogoUpload: Logo converted to base64 successfully");
          resolve({
            base64,
            type: logoFile.type,
            name: logoFile.name
          });
        };
        
        reader.onerror = (error) => {
          console.error("useLogoUpload: Error reading file:", error);
          toast({
            title: "Erreur",
            description: "Impossible de traiter l'image",
            variant: "destructive"
          });
          resolve(null);
        };
        
        reader.readAsDataURL(logoFile);
      });
    } catch (error) {
      console.error("useLogoUpload: Upload error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter l'image",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    logoFile,
    logoPreview,
    setLogoPreview,
    isUploading,
    handleLogoChange,
    uploadLogo,
    resetLogo
  };
};
