
import React from "react";
import { Button } from "@/components/ui/button";

interface LeaveAllocationFormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isLoading: boolean;
}

const LeaveAllocationFormActions: React.FC<LeaveAllocationFormActionsProps> = ({
  onCancel,
  isSubmitting,
  isLoading,
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Annuler
      </Button>
      <Button
        type="submit"
        className="bg-emerald-500 hover:bg-emerald-600"
        disabled={isSubmitting || isLoading}
      >
        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </div>
  );
};

export default LeaveAllocationFormActions;
