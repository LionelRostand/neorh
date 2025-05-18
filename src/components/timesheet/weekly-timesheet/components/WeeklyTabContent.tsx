
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody } from "@/components/ui/table";
import ProjectRow from './ProjectRow';
import EmptyProjectsRow from '../../../timesheet/weekly-projects/EmptyProjectsRow';
import TotalDaysDisplay from '../../../timesheet/weekly-projects/TotalDaysDisplay';
import ProjectTableHeader from '../../../timesheet/weekly-projects/ProjectTableHeader';
import { Project, WeeklyData } from "../../types";

interface WeeklyTabContentProps {
  week: WeeklyData;
  weekIndex: number;
  projects: Project[];
  selectedProject: string;
  setSelectedProject: (projectId: string) => void;
  handleAddProject: (weekIndex: number) => void;
  handleUpdateDays: (weekIndex: number, projectIndex: number, days: number) => void;
  handleRemoveProject: (weekIndex: number, projectIndex: number) => void;
}

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
        <Button onClick={() => handleAddProject(weekIndex)}>Ajouter le projet</Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <ProjectTableHeader />
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
            {week.projects.length === 0 && <EmptyProjectsRow />}
            <TotalDaysDisplay projects={week.projects} />
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WeeklyTabContent;
