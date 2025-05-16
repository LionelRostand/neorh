
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";

interface LeavesHeaderProps {
  onNewRequest: () => void;
}

const LeavesHeader = ({ onNewRequest }: LeavesHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Congés</h1>
        <p className="text-gray-500">Gestion des demandes de congés</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filtres
        </Button>
        <Button 
          variant="default" 
          className="gap-2 bg-emerald-500 hover:bg-emerald-600" 
          onClick={onNewRequest}
        >
          <Plus className="h-4 w-4" /> Nouvelle demande
        </Button>
      </div>
    </div>
  );
};

export default LeavesHeader;
