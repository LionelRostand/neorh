
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import NewProjectDialog from './NewProjectDialog';

const ProjectsHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold">Gestion des Projets</h2>
      <div className="flex items-center gap-3">
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouveau Projet
        </Button>
      </div>

      <NewProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default ProjectsHeader;
