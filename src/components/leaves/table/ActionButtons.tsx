
import React from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  leaveId: string;
  status: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const ActionButtons = ({ leaveId, status, onApprove, onReject }: ActionButtonsProps) => {
  if (status !== 'pending') {
    return <span className="text-gray-400 text-sm">Action déjà effectuée</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        className="text-green-600 hover:text-green-800 hover:bg-green-50 p-2 h-8" 
        onClick={() => onApprove(leaveId)}
      >
        <Check className="h-4 w-4 mr-1" /> Approuver
      </Button>
      <Button 
        variant="ghost" 
        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 h-8" 
        onClick={() => onReject(leaveId)}
      >
        <X className="h-4 w-4 mr-1" /> Refuser
      </Button>
    </div>
  );
};

export default ActionButtons;
