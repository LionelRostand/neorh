
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProjectsHeaderProps {
  onNewProject: () => void;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ onNewProject }) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Gestion des projets</h1>
      <Button onClick={onNewProject}>
        <Plus className="h-4 w-4 mr-2" />
        Nouveau
      </Button>
    </div>
  );
};

export default ProjectsHeader;
