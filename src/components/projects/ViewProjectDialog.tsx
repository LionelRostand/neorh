
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/project';
import { formatDate } from '@/utils/formatters';
import { ProjectStatusBadge } from './ProjectStatusBadge';

interface ViewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

const ViewProjectDialog: React.FC<ViewProjectDialogProps> = ({ 
  open, 
  onOpenChange, 
  project 
}) => {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{project.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Client</h3>
              <p>{project.client}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Statut</h3>
              <ProjectStatusBadge status={project.status} />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date de début</h3>
              <p>{formatDate(project.startDate)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date de fin prévue</h3>
              <p>{project.endDate ? formatDate(project.endDate) : 'Non définie'}</p>
            </div>
            
            {project.budget && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Budget</h3>
                <p>{project.budget.toLocaleString('fr-FR')} €</p>
              </div>
            )}
            
            {project.budgetSpent && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Budget dépensé</h3>
                <p>{project.budgetSpent.toLocaleString('fr-FR')} €</p>
              </div>
            )}
            
            {project.progress !== undefined && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Progression</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-right mt-1">{project.progress}%</p>
              </div>
            )}
          </div>
          
          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="text-sm">{project.description}</p>
          </div>
          
          {project.manager && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Chef de projet</h3>
              <p>{project.manager.name}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProjectDialog;
