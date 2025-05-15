
import React from "react";
import { Button } from "@/components/ui/button";
import { Building, X } from "lucide-react";

interface FormActionsProps {
  onCancel: () => void;
  isLoading: boolean;
  isUploading: boolean;
}

const FormActions = ({ onCancel, isLoading, isUploading }: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        <X className="h-4 w-4 mr-2" /> Annuler
      </Button>
      <Button 
        type="submit" 
        className="bg-emerald-600 hover:bg-emerald-700"
        disabled={isLoading || isUploading}
      >
        <Building className="h-4 w-4 mr-2" /> Créer l'entreprise
      </Button>
    </div>
  );
};

export default FormActions;
