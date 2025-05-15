
import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

export function usePhotoUpload() {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return null;
    
    setIsUploading(true);
    try {
      // Créer un nom de fichier unique avec l'horodatage
      const fileName = `employee_photos/${Date.now()}_${photoFile.name}`;
      const storageRef = ref(storage, fileName);
      
      // Téléverser le fichier
      await uploadBytes(storageRef, photoFile);
      
      // Obtenir l'URL de téléchargement
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Erreur lors du téléversement de la photo:", error);
      toast({
        title: "Erreur",
        description: "Impossible de téléverser la photo",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    photoFile,
    photoPreview,
    isUploading,
    setIsUploading,
    handlePhotoChange,
    uploadPhoto
  };
}
