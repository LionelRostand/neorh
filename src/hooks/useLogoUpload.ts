
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export function useLogoUpload() {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Vérifier le type de fichier (uniquement images)
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner un fichier image",
          variant: "destructive"
        });
        return;
      }

      // Vérifier la taille du fichier (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "La taille du fichier ne doit pas dépasser 2MB",
          variant: "destructive"
        });
        return;
      }
      
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      
      // Convertir le fichier en base64
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          // Extraire la partie base64 de la chaîne data URL
          const base64String = event.target.result as string;
          setLogoBase64(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Cette fonction renvoie maintenant les données au format base64
  const uploadLogo = async (): Promise<{ base64: string | null, type: string | null, name: string | null } | null> => {
    if (!logoFile || !logoBase64) return null;
    
    setIsUploading(true);
    try {
      return {
        base64: logoBase64,
        type: logoFile.type,
        name: logoFile.name
      };
    } catch (error) {
      console.error("Erreur lors de la préparation du logo:", error);
      toast({
        title: "Erreur",
        description: "Impossible de préparer le logo",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const resetLogo = () => {
    setLogoFile(null);
    setLogoBase64(null);
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview(null);
  };

  return {
    logoFile,
    logoPreview,
    isUploading,
    handleLogoChange,
    uploadLogo,
    resetLogo,
    setLogoPreview
  };
}
