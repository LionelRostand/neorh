
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Project } from '@/types/project';

interface ProjectsStatusCardsProps {
  projects: Project[] | undefined;
  isLoading: boolean;
}

const ProjectsStatusCards: React.FC<ProjectsStatusCardsProps> = ({ projects, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border">
            <CardContent className="p-6">
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-10 w-10 mb-1" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const activeProjects = projects?.filter(p => p.status === 'active') || [];
  const completedProjects = projects?.filter(p => p.status === 'completed') || [];
  const pendingProjects = projects?.filter(p => p.status === 'pending') || [];
  
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border border-green-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-green-700">Projets actifs</h3>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <div className="h-5 w-5 rounded-full bg-green-500"></div>
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{activeProjects.length}</p>
          <p className="text-sm text-muted-foreground">
            {activeProjects.length === 1 ? '1 projet actif' : `${activeProjects.length} projets actifs`}
          </p>
        </CardContent>
      </Card>
      
      <Card className="border border-yellow-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-yellow-700">En attente</h3>
            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <div className="h-5 w-5 rounded-full bg-yellow-500"></div>
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{pendingProjects.length}</p>
          <p className="text-sm text-muted-foreground">
            {pendingProjects.length === 0 ? 'Aucun projet en attente' : pendingProjects.length === 1 ? '1 projet en attente' : `${pendingProjects.length} projets en attente`}
          </p>
        </CardContent>
      </Card>
      
      <Card className="border border-blue-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-blue-700">Terminés</h3>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <div className="h-5 w-5 rounded-full bg-blue-500"></div>
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{completedProjects.length}</p>
          <p className="text-sm text-muted-foreground">
            {completedProjects.length === 0 ? 'Aucun projet terminé' : completedProjects.length === 1 ? '1 projet terminé' : `${completedProjects.length} projets terminés`}
          </p>
        </CardContent>
      </Card>
      
      <Card className="border">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Total</h3>
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <div className="h-5 w-5 rounded-full bg-gray-500"></div>
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{projects?.length || 0}</p>
          <p className="text-sm text-muted-foreground">
            {!projects?.length ? 'Aucun projet' : projects.length === 1 ? '1 projet au total' : `${projects.length} projets au total`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsStatusCards;
