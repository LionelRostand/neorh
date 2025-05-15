
import React from "react";
import { Button } from "@/components/ui/button";

interface CompanyErrorProps {
  onClose: () => void;
}

const CompanyError = ({ onClose }: CompanyErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <p className="text-red-500">Impossible de charger les informations de l'entreprise</p>
      <Button variant="outline" onClick={onClose} className="mt-4">
        Fermer
      </Button>
    </div>
  );
};

export default CompanyError;
