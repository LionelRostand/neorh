
import React from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface SubmitButtonProps {
  isLoading?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading = false }) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-emerald-600 hover:bg-emerald-700 transition-colors"
      disabled={isLoading}
    >
      <Send className="mr-2 h-4 w-4" />
      {isLoading ? "Génération en cours..." : "Générer la fiche de paie"}
    </Button>
  );
};

export default SubmitButton;
