
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ContractsHeaderProps {
  onNewContract: () => void;
}

const ContractsHeader: React.FC<ContractsHeaderProps> = ({ onNewContract }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Gestion des contrats</h1>
        <p className="text-muted-foreground">Gérez les contrats des employés</p>
      </div>
      <Button 
        onClick={onNewContract} 
        className="gap-2 bg-emerald-600 hover:bg-emerald-700"
      >
        <Plus className="h-4 w-4" /> Nouveau contrat
      </Button>
    </div>
  );
};

export default ContractsHeader;
