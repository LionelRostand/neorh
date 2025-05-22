
import React from "react";
import { useProjectsPage } from "@/hooks/useProjectsPage";
import ProjectsHeader from "@/components/projects/ProjectsHeader";
import ProjectsContent from "@/components/projects/ProjectsContent";
import ProjectsDebugInfo from "@/components/projects/ProjectsDebugInfo";
import NewProjectDialog from "@/components/projects/NewProjectDialog";

const Projets = () => {
  const {
    projects,
    isLoading,
    error,
    stats,
    newProjectDialogOpen,
    setNewProjectDialogOpen,
    loadProjects,
    handleNewProject,
    handleEdit,
    handleDelete,
    handleView
  } = useProjectsPage();

  return (
    <div className="space-y-6 p-6">
      {/* Header with title and button */}
      <ProjectsHeader onNewProject={handleNewProject} />

      {/* Main content - stats and projects table */}
      <ProjectsContent
        projects={projects}
        isLoading={isLoading}
        error={error}
        stats={stats}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* New project dialog */}
      <NewProjectDialog
        open={newProjectDialogOpen}
        onOpenChange={setNewProjectDialogOpen}
        onSuccess={loadProjects}
      />

      {/* Debug info */}
      <ProjectsDebugInfo projects={projects} />
    </div>
  );
};

export default Projets;
