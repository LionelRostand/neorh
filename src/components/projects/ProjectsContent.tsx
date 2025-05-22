
import React from "react";
import { Project } from "@/types/project";
import ProjectsTable from "@/components/projects/ProjectsTable";
import ProjectsStats from "@/components/projects/ProjectsStats";

interface ProjectsContentProps {
  projects: Project[];
  isLoading: boolean;
  error: Error | null;
  stats: {
    total: number;
    active: number;
    pending: number;
    expired: number;
  };
  onEdit: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  onView: (projectId: string) => void;
}

const ProjectsContent: React.FC<ProjectsContentProps> = ({
  projects,
  isLoading,
  error,
  stats,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <>
      {/* Status Cards */}
      <ProjectsStats stats={stats} />

      {/* Projects table */}
      <ProjectsTable
        projects={projects}
        isLoading={isLoading}
        error={error}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    </>
  );
};

export default ProjectsContent;
