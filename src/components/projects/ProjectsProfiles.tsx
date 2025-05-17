
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Project } from '@/types/project';
import ProjectSearch from './ProjectSearch';
import ProjectsTable from './ProjectsTable';
import ProjectEmptyState from './ProjectEmptyState';
import ProjectPagination from './ProjectPagination';
import ProjectTableSkeleton from './ProjectTableSkeleton';
import { useProjectFilters } from '@/hooks/useProjectFilters';
import EditProjectDialog from './EditProjectDialog';
import DeleteProjectConfirmDialog from './DeleteProjectConfirmDialog';
import ViewProjectDialog from './ViewProjectDialog';

interface ProjectsProfilesProps {
  projects: Project[] | undefined;
  isLoading: boolean;
  onRefresh?: () => void;
}

const ProjectsProfiles: React.FC<ProjectsProfilesProps> = ({ 
  projects = [], 
  isLoading,
  onRefresh 
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    sortField,
    sortDirection,
    paginatedProjects,
    filteredAndSortedProjects,
    totalPages,
    PAGE_SIZE,
    handleSort,
    handlePageChange
  } = useProjectFilters(projects);

  const handleEdit = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setIsEditDialogOpen(true);
    } else {
      toast({
        title: "Erreur",
        description: "Projet non trouvé",
        variant: "destructive"
      });
    }
  };

  const handleDelete = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setIsDeleteDialogOpen(true);
    } else {
      toast({
        title: "Erreur",
        description: "Projet non trouvé",
        variant: "destructive"
      });
    }
  };
  
  const handleView = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setViewDialogOpen(true);
    } else {
      toast({
        title: "Erreur",
        description: "Projet non trouvé",
        variant: "destructive"
      });
    }
  };

  const handleSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  if (isLoading) {
    return <ProjectTableSkeleton />;
  }

  return (
    <div className="p-4">
      <ProjectSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {filteredAndSortedProjects.length === 0 ? (
        <ProjectEmptyState />
      ) : (
        <>
          <ProjectsTable 
            projects={paginatedProjects}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleView={handleView}
          />
          
          <ProjectPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Dialogs for Edit, Delete and View */}
      <EditProjectDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        project={selectedProject}
        onSuccess={handleSuccess}
      />

      <DeleteProjectConfirmDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        project={selectedProject}
        onSuccess={handleSuccess}
      />
      
      <ViewProjectDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        project={selectedProject}
      />
    </div>
  );
};

export default ProjectsProfiles;
