
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Evaluation } from "@/hooks/useEmployeeEvaluations";
import { Skeleton } from "@/components/ui/skeleton";

interface ViewEvaluationDialogProps {
  evaluationId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluations: Evaluation[];
}

const ViewEvaluationDialog: React.FC<ViewEvaluationDialogProps> = ({ 
  evaluationId, 
  open, 
  onOpenChange,
  evaluations
}) => {
  const evaluation = evaluations.find(e => e.id === evaluationId);

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case "planifiée":
        return "bg-emerald-600 hover:bg-emerald-700";
      case "complétée":
        return "bg-blue-600 hover:bg-blue-700";
      case "annulée":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  if (!evaluation && evaluationId) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chargement de l'évaluation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!evaluation) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Évaluation non trouvée</DialogTitle>
          </DialogHeader>
          <Card className="border border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-red-600 font-medium">Impossible de trouver cette évaluation</p>
                <p className="text-sm text-red-500">L'évaluation demandée n'existe pas ou a été supprimée.</p>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{evaluation.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p>{evaluation.date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Évaluateur</p>
              <p>{evaluation.evaluator}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <Badge className={getStatusBadgeClass(evaluation.status)}>
              {evaluation.status}
            </Badge>
          </div>
          
          {evaluation.comments && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Commentaires</p>
              <p className="text-sm">{evaluation.comments}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewEvaluationDialog;
