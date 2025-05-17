
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Project } from '@/types/project';

interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onSuccess?: () => void;
}

const EditProjectDialog: React.FC<EditProjectDialogProps> = ({ 
  open, 
  onOpenChange, 
  project,
  onSuccess 
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // This would typically update data via an API
    toast({
      title: "Fonctionnalité à venir",
      description: "La modification de projets sera bientôt disponible."
    });
    onOpenChange(false);
    if (onSuccess) onSuccess();
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Modifier le projet : {project.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="flex flex-col space-y-2">
            <p className="text-center text-muted-foreground">
              Cette fonctionnalité sera disponible prochainement.
              <br />
              Vous pourrez modifier les projets existants.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
