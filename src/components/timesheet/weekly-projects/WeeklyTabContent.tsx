
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProjectSelector from "./ProjectSelector";
import ProjectRow from "./ProjectRow";
import { WeeklyTabContentProps } from "../types";
import { mockProjects } from "./utils";

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
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projet</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Jours (max 5)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {week.projects.map((project, projectIndex) => {
              const projectDetails = projects.find(p => p.id === project.projectId) || { id: project.projectId, name: 'Inconnu' };
              return (
                <ProjectRow 
                  key={projectIndex}
                  project={project}
                  projectIndex={projectIndex}
                  weekIndex={weekIndex}
                  projectDetails={projectDetails}
                  onUpdateDays={handleUpdateDays}
                  onRemoveProject={handleRemoveProject}
                />
              );
            })}
            {week.projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                  Aucun projet ajouté pour cette semaine
                </TableCell>
              </TableRow>
            )}
            <TableRow className="bg-gray-50">
              <TableCell colSpan={2} className="font-bold">
                Total
              </TableCell>
              <TableCell colSpan={2} className={
                week.projects.reduce((sum, p) => sum + p.days, 0) > 5 
                  ? 'font-bold text-red-600' 
                  : 'font-bold'
              }>
                {week.projects.reduce((sum, p) => sum + p.days, 0)} / 5 jours
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WeeklyTabContent;
