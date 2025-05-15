
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface CompanyErrorProps {
  onClose: () => void;
}

const CompanyError = ({ onClose }: CompanyErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 h-64">
      <AlertTriangle className="h-10 w-10 text-red-500 mb-2" />
      <p className="text-red-500 font-medium mb-4">Impossible de charger les informations de l'entreprise</p>
      <Button variant="outline" onClick={onClose}>
        Fermer
      </Button>
    </div>
  );
};

export default CompanyError;
