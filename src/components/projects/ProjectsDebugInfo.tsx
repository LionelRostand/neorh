
import React from "react";
import { Project } from "@/types/project";

interface ProjectsDebugInfoProps {
  projects: Project[];
}

const ProjectsDebugInfo: React.FC<ProjectsDebugInfoProps> = ({ projects }) => {
  return (
    <div className="text-xs text-gray-500 text-center pt-4 border-t">
      Nombre de projets: {projects.length}
    </div>
  );
};

export default ProjectsDebugInfo;
