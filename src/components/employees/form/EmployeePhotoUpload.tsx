
import React from 'react';
import { User, Upload } from 'lucide-react';

interface EmployeePhotoUploadProps {
  photoPreview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EmployeePhotoUpload({ photoPreview, onChange }: EmployeePhotoUploadProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-sm">Photo de profil</h3>
      </div>
      
      <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border">
        {photoPreview ? (
          <img 
            src={photoPreview} 
            alt="Aperçu" 
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-12 w-12 text-gray-400" />
        )}
      </div>
      
      <div>
        <label htmlFor="photo-upload" className="cursor-pointer">
          <div className="flex items-center justify-center">
            <Upload className="w-4 h-4 mr-2" />
            <span className="text-sm">Choisir une photo</span>
          </div>
          <input 
            id="photo-upload"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onChange}
          />
        </label>
      </div>
    </div>
  );
}
