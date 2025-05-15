
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export function useLogoUpload() {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [logoBinary, setLogoBinary] = useState<ArrayBuffer | null>(null);

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
      
      // Lire le fichier en tant que ArrayBuffer pour le stockage binaire
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setLogoBinary(event.target.result as ArrayBuffer);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Cette fonction n'utilise plus Firebase Storage
  const uploadLogo = async (): Promise<{ binary: ArrayBuffer | null, type: string | null, name: string | null } | null> => {
    if (!logoFile || !logoBinary) return null;
    
    setIsUploading(true);
    try {
      // Retourne directement les données binaires et le type MIME
      return {
        binary: logoBinary,
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
    setLogoBinary(null);
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
