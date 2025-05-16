
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export function usePhotoUpload() {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Charger la photo depuis le localStorage lors de l'initialisation
  useEffect(() => {
    const savedPhoto = localStorage.getItem('employeePhotoPreview');
    if (savedPhoto) {
      setPhotoPreview(savedPhoto);
    }
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      // Convertir en base64 et sauvegarder dans localStorage
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPhotoPreview(base64);
        localStorage.setItem('employeePhotoPreview', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoPreview) return null;
    
    setIsUploading(true);
    try {
      // Retourner directement le base64 au lieu de téléverser sur Firebase Storage
      return photoPreview;
    } catch (error) {
      console.error("Erreur lors du traitement de la photo:", error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter la photo",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const resetPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    localStorage.removeItem('employeePhotoPreview');
  };

  return {
    photoFile,
    photoPreview,
    isUploading,
    setIsUploading,
    handlePhotoChange,
    uploadPhoto,
    resetPhoto
  };
}
