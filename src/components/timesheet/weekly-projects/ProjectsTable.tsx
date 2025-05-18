
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import ProjectRow from "./ProjectRow";
import EmptyProjectsRow from "./EmptyProjectsRow";
import TotalDaysDisplay from "./TotalDaysDisplay";
import ProjectTableHeader from "./ProjectTableHeader";
import { Project, WeeklyData } from "../types";

interface ProjectsTableProps {
  week: WeeklyData;
  weekIndex: number;
  projects: Project[];
  onUpdateDays: (weekIndex: number, projectIndex: number, days: number) => void;
  onRemoveProject: (weekIndex: number, projectIndex: number) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ 
  week,
  weekIndex,
  projects,
  onUpdateDays,
  onRemoveProject
}) => {
  return (
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
                onUpdateDays={onUpdateDays}
                onRemoveProject={onRemoveProject}
              />
            );
          })}
          {week.projects.length === 0 && <EmptyProjectsRow />}
          <TotalDaysDisplay projects={week.projects} />
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;
