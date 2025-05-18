
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
  return (
    <div className="flex flex-col md:flex-row mb-4 gap-4">
      <Select value={selectedProject} onValueChange={setSelectedProject}>
        <SelectTrigger className="w-full md:w-[280px]">
          <SelectValue placeholder="Sélectionner un projet" />
        </SelectTrigger>
        <SelectContent>
          {projects.map(project => (
            <SelectItem key={project.id} value={project.id}>
              {project.name} ({project.id})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={onAddProject}>Ajouter le projet</Button>
    </div>
  );
};

export default ProjectSelector;
