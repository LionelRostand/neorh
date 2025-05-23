
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ProjectSelectorProps } from "../types";

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ 
  projects, 
  selectedProject, 
  setSelectedProject, 
  onAddProject 
}) => {
  console.log("ProjectSelector - Projects received:", projects);
  console.log("ProjectSelector - Selected project:", selectedProject);

  return (
    <div className="flex flex-col md:flex-row mb-4 gap-4">
      <Select value={selectedProject} onValueChange={setSelectedProject}>
        <SelectTrigger className="w-full md:w-[280px]">
          <SelectValue placeholder="Sélectionner un projet" />
        </SelectTrigger>
        <SelectContent className="bg-white z-50 max-h-60 overflow-y-auto">
          {projects.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">Aucun projet disponible</p>
              <p className="text-xs mt-1">Créez des projets dans le menu Projets</p>
            </div>
          ) : (
            projects.map(project => (
              <SelectItem key={project.id} value={project.id || ''}>
                <div className="flex flex-col">
                  <span className="font-medium">{project.name}</span>
                  <span className="text-xs text-gray-500">ID: {project.id}</span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      <Button 
        onClick={onAddProject}
        disabled={!selectedProject || selectedProject === 'no-projects' || projects.length === 0}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Ajouter le projet
      </Button>
    </div>
  );
};

export default ProjectSelector;
