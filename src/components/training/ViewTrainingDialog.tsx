
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Training } from "@/hooks/useTrainingData";
import { Skeleton } from "@/components/ui/skeleton";

interface ViewTrainingDialogProps {
  trainingId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainings: Training[];
}

const ViewTrainingDialog: React.FC<ViewTrainingDialogProps> = ({ 
  trainingId, 
  open, 
  onOpenChange,
  trainings
}) => {
  const training = trainings.find(t => t.id === trainingId);

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

  if (!training && trainingId) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chargement de la formation</DialogTitle>
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

  if (!training) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Formation non trouvée</DialogTitle>
          </DialogHeader>
          <Card className="border border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-red-600 font-medium">Impossible de trouver cette formation</p>
                <p className="text-sm text-red-500">La formation demandée n'existe pas ou a été supprimée.</p>
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
          <DialogTitle>{training.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
            <p>{training.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Formateur</p>
              <p>{training.trainer}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Département</p>
              <p>{training.department}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge className={getStatusBadgeClass(training.status)}>
                {training.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Participants</p>
              <p>{training.participants}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTrainingDialog;
