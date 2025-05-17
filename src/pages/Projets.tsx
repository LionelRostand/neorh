
import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import ProjectsContent from '@/components/projects/ProjectsContent';

export default function Projets() {
  return (
    <div className="flex h-full flex-col space-y-6 p-8">
      <PageHeader 
        title="Projets" 
        description="Gérez les projets et suivez leur avancement" 
      />
      
      <ProjectsContent />
    </div>
  );
}
