
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Edit } from "lucide-react";

interface ContractActionsProps {
  contractId: string;
  onDetails: (id: string) => void;
  onEdit: (id: string) => void;
}

const ContractActions = ({ contractId, onDetails, onEdit }: ContractActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 px-2" 
        onClick={() => onDetails(contractId)}
      >
        <FileText className="h-4 w-4 mr-1" /> Détails
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 px-2" 
        onClick={() => onEdit(contractId)}
      >
        <Edit className="h-4 w-4 mr-1" /> Modifier
      </Button>
    </div>
  );
};

export default ContractActions;
