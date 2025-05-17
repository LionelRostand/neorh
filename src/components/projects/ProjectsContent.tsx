
import React from 'react';
import ProjectsHeader from './ProjectsHeader';
import ProjectsStatusCards from './ProjectsStatusCards';
import ProjectsProfiles from './ProjectsProfiles';
import { useProjects } from '@/hooks/useProjects';

const ProjectsContent = () => {
  const { 
    projects,
    isLoading,
    error,
    refetch
  } = useProjects();

  return (
    <div className="flex flex-col gap-6">
      <ProjectsHeader />
      <ProjectsStatusCards projects={projects} isLoading={isLoading} />
      <ProjectsProfiles 
        projects={projects} 
        isLoading={isLoading} 
        onRefresh={refetch} 
      />
    </div>
  );
};

export default ProjectsContent;
