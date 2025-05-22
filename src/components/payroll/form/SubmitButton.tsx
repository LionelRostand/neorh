
import React from "react";
import { Button } from "@/components/ui/button";

const SubmitButton: React.FC = () => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-emerald-600 hover:bg-emerald-700"
    >
      Générer la fiche de paie
    </Button>
  );
};

export default SubmitButton;
