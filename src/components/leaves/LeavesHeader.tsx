
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, Plus, Calendar, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        
        {/* Bouton unifié avec menu déroulant */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="default" 
              className="gap-2 bg-emerald-500 hover:bg-emerald-600"
            >
              <Plus className="h-4 w-4" /> Nouvelle attribution
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onNewAllocation && (
              <DropdownMenuItem onClick={onNewAllocation}>
                <Calendar className="h-4 w-4 mr-2" /> Attribution simple
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onNewRequest}>
              <Calendar className="h-4 w-4 mr-2" /> Attribution sur période
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default LeavesHeader;
