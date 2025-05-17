
import React from 'react';
import { FolderOpen } from 'lucide-react';

const ProjectEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border rounded-lg bg-white">
      <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium">Aucun projet trouvé</h3>
      <p className="text-sm text-gray-500 mt-2 max-w-sm">
        Il n'y a pas de projets correspondants à votre recherche ou vous n'avez pas encore créé de projets.
      </p>
    </div>
  );
};

export default ProjectEmptyState;
