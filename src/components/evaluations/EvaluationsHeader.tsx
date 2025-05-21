
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewEvaluationDialog } from "./NewEvaluationDialog";

interface EvaluationsHeaderProps {
  onNewEvaluation: () => void;
}

const EvaluationsHeader = ({ onNewEvaluation }: EvaluationsHeaderProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion des évaluations</h1>
          <p className="text-muted-foreground">Gérez les évaluations des employés</p>
        </div>
        <div>
          <Button 
            onClick={() => setDialogOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Nouvelle évaluation
          </Button>
        </div>
      </div>

      <NewEvaluationDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSuccess={onNewEvaluation}
      />
    </>
  );
};

export default EvaluationsHeader;
