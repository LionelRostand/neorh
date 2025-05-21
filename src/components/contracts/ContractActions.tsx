
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Edit } from "lucide-react";

interface ContractActionsProps {
  contractId: string;
  onDetails: (id: string) => void;
  onEdit: (id: string) => void;
}

const ContractActions = ({ contractId, onDetails, onEdit }: ContractActionsProps) => {
  // Utilisation de useCallback pour éviter les re-renders inutiles
  const handleDetails = useCallback(() => {
    onDetails(contractId);
  }, [contractId, onDetails]);

  const handleEdit = useCallback(() => {
    onEdit(contractId);
  }, [contractId, onEdit]);

  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 px-2" 
        onClick={handleDetails}
      >
        <FileText className="h-4 w-4 mr-1" /> Détails
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 px-2" 
        onClick={handleEdit}
      >
        <Edit className="h-4 w-4 mr-1" /> Modifier
      </Button>
    </div>
  );
};

export default ContractActions;
