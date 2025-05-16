
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, X, Upload } from "lucide-react";

interface CompanyLogoUploadProps {
  logoUrl: string | null;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

const CompanyLogoUpload = ({ logoUrl, onLogoChange, onReset }: CompanyLogoUploadProps) => {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="border rounded-md w-full max-w-[200px] h-[200px] flex items-center justify-center overflow-hidden bg-gray-50">
        {logoUrl ? (
          <div className="relative w-full h-full">
            <img 
              src={logoUrl} 
              alt="Logo d'entreprise" 
              className="w-full h-full object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={onReset}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-gray-400 flex flex-col items-center justify-center">
            <Image className="h-10 w-10 mb-2" />
            <span className="text-sm">Logo d'entreprise</span>
          </div>
        )}
      </div>
      <div className="w-full max-w-[200px]">
        <label htmlFor="company-logo-upload">
          <div className="flex items-center justify-center w-full">
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer"
              asChild
            >
              <div>
                <Upload className="h-4 w-4 mr-2" />
                Choisir un logo
              </div>
            </Button>
          </div>
          <Input
            id="company-logo-upload"
            type="file"
            accept="image/*"
            onChange={onLogoChange}
            className="hidden"
          />
        </label>
        <div className="text-xs text-muted-foreground mt-1 text-center">
          Formats: JPG, PNG, GIF (max 2MB)
        </div>
      </div>
    </div>
  );
};

export default CompanyLogoUpload;
