
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, Plus, Calendar } from "lucide-react";

interface LeavesHeaderProps {
  onNewRequest: () => void;
  onNewAllocation?: () => void;
}

const LeavesHeader = ({ onNewRequest, onNewAllocation }: LeavesHeaderProps) => {
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
        {onNewAllocation && (
          <Button
            variant="outline"
            className="gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
            onClick={onNewAllocation}
          >
            <Calendar className="h-4 w-4" /> Nouvelle attribution
          </Button>
        )}
        <Button 
          variant="default" 
          className="gap-2 bg-emerald-500 hover:bg-emerald-600" 
          onClick={onNewRequest}
        >
          <Plus className="h-4 w-4" /> Attribution de congés
        </Button>
      </div>
    </div>
  );
};

export default LeavesHeader;
