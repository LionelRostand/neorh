
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
import LeaveUnifiedAllocationForm from "./allocation/LeaveUnifiedAllocationForm";

interface LeavesHeaderProps {
  onNewRequest: () => void;
  onNewAllocation?: () => void;
}

const LeavesHeader = ({ onNewRequest, onNewAllocation }: LeavesHeaderProps) => {
  // État pour contrôler l'ouverture du formulaire unifié
  const [showAllocationForm, setShowAllocationForm] = React.useState(false);
  
  const handleOpenForm = () => {
    setShowAllocationForm(true);
  };

  const handleCloseForm = () => {
    setShowAllocationForm(false);
  };

  const handleSuccess = () => {
    setShowAllocationForm(false);
    // Si onNewRequest ou onNewAllocation était appelé avec des paramètres supplémentaires,
    // nous devrions les transmettre ici
    if (onNewRequest) onNewRequest();
  };

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
          onClick={handleOpenForm}
        >
          <Plus className="h-4 w-4" /> Attribution de congés
        </Button>
        
        {/* Formulaire unifié pour les deux types d'attribution */}
        <LeaveUnifiedAllocationForm
          open={showAllocationForm}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
          canAllocateSimple={!!onNewAllocation}
        />
      </div>
    </div>
  );
};

export default LeavesHeader;
