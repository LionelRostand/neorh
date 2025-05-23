
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/project";

interface ViewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

const ViewProjectDialog: React.FC<ViewProjectDialogProps> = ({
  open,
  onOpenChange,
  project,
}) => {
  if (!project) return null;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'completed':
        return 'outline';
      case 'canceled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails du projet</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nom du projet</label>
              <p className="mt-1 text-sm text-gray-900">{project.name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Statut</label>
              <div className="mt-1">
                <Badge variant={getStatusBadgeVariant(project.status)}>
                  {project.status === 'active' && 'Actif'}
                  {project.status === 'pending' && 'En attente'}
                  {project.status === 'completed' && 'Terminé'}
                  {project.status === 'canceled' && 'Annulé'}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Date de début</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(project.startDate)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Date de fin</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(project.endDate)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Budget</label>
              <p className="mt-1 text-sm text-gray-900">
                {project.budget ? `${project.budget.toLocaleString('fr-FR')} €` : '-'}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">ID du projet</label>
              <p className="mt-1 text-sm text-gray-500 font-mono">{project.id}</p>
            </div>
          </div>
          
          {project.description && (
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{project.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Créé le</label>
              <p className="mt-1 text-sm text-gray-500">{formatDate(project.createdAt)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Modifié le</label>
              <p className="mt-1 text-sm text-gray-500">{formatDate(project.updatedAt)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProjectDialog;
