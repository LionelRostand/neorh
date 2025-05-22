
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Edit, Trash2 } from "lucide-react";

interface ContractActionsProps {
  contractId: string;
  onDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ContractActions = ({ contractId, onDetails, onEdit, onDelete }: ContractActionsProps) => {
  // Utilisation de useCallback pour éviter les re-renders inutiles
  const handleDetails = useCallback(() => {
    onDetails(contractId);
  }, [contractId, onDetails]);

  const handleEdit = useCallback(() => {
    onEdit(contractId);
  }, [contractId, onEdit]);
  
  const handleDelete = useCallback(() => {
    onDelete(contractId);
  }, [contractId, onDelete]);

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
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 px-2"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4 mr-1 text-red-500" /> Supprimer
      </Button>
    </div>
  );
};

export default ContractActions;
