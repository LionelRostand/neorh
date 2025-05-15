
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface FormActionsProps {
  onCancel: () => void;
  isUpdating: boolean;
  isUploading: boolean;
}

const FormActions = ({ onCancel, isUpdating, isUploading }: FormActionsProps) => {
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
        className="bg-blue-600 hover:bg-blue-700"
        disabled={isUpdating || isUploading}
      >
        <Save className="h-4 w-4 mr-2" /> Enregistrer les modifications
      </Button>
    </div>
  );
};

export default FormActions;
