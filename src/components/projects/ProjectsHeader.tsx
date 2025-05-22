
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProjectsHeaderProps {
  onNewProject: () => void;
  title?: string;
  buttonText?: string;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ 
  onNewProject, 
  title = "Gestion des projets",
  buttonText = "Nouveau"
}) => {
  return (
    <div className="flex justify-between items-center p-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button onClick={onNewProject}>
        <Plus className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>
    </div>
  );
};

export default ProjectsHeader;
