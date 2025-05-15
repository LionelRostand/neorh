
import React from "react";
import { Button } from "@/components/ui/button";
import { File, Edit } from "lucide-react";

interface CompanyActionsProps {
  companyId: string;
  onDetails: (id: string) => void;
  onEdit: (id: string) => void;
}

const CompanyActions = ({ companyId, onDetails, onEdit }: CompanyActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 px-2" 
        onClick={() => onDetails(companyId)}
      >
        <File className="h-4 w-4 mr-1" /> Détails
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 px-2" 
        onClick={() => onEdit(companyId)}
      >
        <Edit className="h-4 w-4 mr-1" /> Modifier
      </Button>
    </div>
  );
};

export default CompanyActions;
