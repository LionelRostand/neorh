
import React from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const SubmitButton: React.FC = () => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-emerald-600 hover:bg-emerald-700 transition-colors"
    >
      <Send className="mr-2 h-4 w-4" />
      Générer la fiche de paie
    </Button>
  );
};

export default SubmitButton;
