
import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

export function useLogoUpload() {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
      
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return null;
    
    setIsUploading(true);
    try {
      // Créer un nom de fichier unique avec l'horodatage
      const fileName = `company_logos/${Date.now()}_${logoFile.name}`;
      const storageRef = ref(storage, fileName);
      
      // Téléverser le fichier
      await uploadBytes(storageRef, logoFile);
      
      // Obtenir l'URL de téléchargement
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Erreur lors du téléversement du logo:", error);
      toast({
        title: "Erreur",
        description: "Impossible de téléverser le logo",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const resetLogo = () => {
    setLogoFile(null);
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
    resetLogo
  };
}
