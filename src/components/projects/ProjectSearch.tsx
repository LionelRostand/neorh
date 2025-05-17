
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface ProjectSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ProjectSearch: React.FC<ProjectSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
      <div className="flex w-full sm:w-auto items-center space-x-2">
        <Input
          placeholder="Rechercher un projet..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-[300px]"
        />
      </div>
      <div className="flex items-center space-x-2 justify-end">
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtres
        </Button>
      </div>
    </div>
  );
};

export default ProjectSearch;
