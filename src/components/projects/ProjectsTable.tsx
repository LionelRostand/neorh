
import React from 'react';
import { Project } from '@/types/project';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Eye, Pencil, Trash2 } from 'lucide-react';
import { formatDate } from '@/utils/formatters';
import ProjectStatusBadge from './ProjectStatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProjectsTableProps {
  projects: Project[];
  currentPage: number;
  pageSize: number;
  sortField: keyof Project | '';
  sortDirection: 'asc' | 'desc';
  handleSort: (field: keyof Project) => void;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  handleView: (id: string) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  sortField,
  sortDirection,
  handleSort,
  handleEdit,
  handleDelete,
  handleView
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <Button 
                variant="ghost" 
                onClick={() => handleSort('name')}
                className="hover:bg-transparent p-0 font-medium flex items-center"
              >
                Nom
                {sortField === 'name' && (
                  <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180 transform' : ''}`} />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort('client')}
                className="hover:bg-transparent p-0 font-medium flex items-center"
              >
                Client
                {sortField === 'client' && (
                  <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180 transform' : ''}`} />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort('manager')}
                className="hover:bg-transparent p-0 font-medium flex items-center"
              >
                Responsable
                {sortField === 'manager' && (
                  <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180 transform' : ''}`} />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort('status')}
                className="hover:bg-transparent p-0 font-medium flex items-center"
              >
                Statut
                {sortField === 'status' && (
                  <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180 transform' : ''}`} />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort('startDate')}
                className="hover:bg-transparent p-0 font-medium flex items-center"
              >
                Date de début
                {sortField === 'startDate' && (
                  <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180 transform' : ''}`} />
                )}
              </Button>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell>{project.client}</TableCell>
              <TableCell>
                {project.manager && (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={project.manager.photoURL || ''} alt={project.manager.name} />
                      <AvatarFallback>{project.manager.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{project.manager.name}</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <ProjectStatusBadge status={project.status} />
              </TableCell>
              <TableCell>{formatDate(project.startDate)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(project.id)}
                    title="Voir"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(project.id)}
                    title="Modifier"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(project.id)}
                    title="Supprimer"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;
