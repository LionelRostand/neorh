
import React from 'react';
import ProjectSelector from "./ProjectSelector";
import ProjectsTable from "./ProjectsTable";
import { WeeklyTabContentProps } from "../types";

const WeeklyTabContent: React.FC<WeeklyTabContentProps> = ({ 
  week,
  weekIndex,
  projects,
  selectedProject,
  setSelectedProject,
  handleAddProject,
  handleUpdateDays,
  handleRemoveProject
}) => {
  return (
    <div className="space-y-4">
      <ProjectSelector 
        projects={projects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        onAddProject={() => handleAddProject(weekIndex)}
      />
      
      <ProjectsTable
        week={week}
        weekIndex={weekIndex}
        projects={projects}
        onUpdateDays={handleUpdateDays}
        onRemoveProject={handleRemoveProject}
      />
    </div>
  );
};

export default WeeklyTabContent;
