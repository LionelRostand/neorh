
import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id?: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  managerId?: string;
  budget?: number;
  clientId?: string;
}

interface ProjectsTableProps {
  projects: Project[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  onView: (projectId: string) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  isLoading,
  error,
  onEdit,
  onDelete,
  onView,
}) => {
  // Fonction pour simplifier les IDs et les rendre plus faciles à retenir
  const getSimplifiedId = (id: string | undefined): string => {
    if (!id) return "-";
    // Prendre seulement les 8 premiers caractères
    return id.substring(0, 8);
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">Liste des projets</h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date de début</TableHead>
              <TableHead>Date de fin</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Chargement des projets...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-red-500">
                  Erreur: {error.message}
                </TableCell>
              </TableRow>
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Aucun projet trouvé
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-mono text-sm">
                    <span title={project.id} className="cursor-help">
                      {getSimplifiedId(project.id)}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.description || '-'}</TableCell>
                  <TableCell>{project.startDate || '-'}</TableCell>
                  <TableCell>{project.endDate || '-'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline"
                        size="sm" 
                        onClick={() => onEdit(project.id as string)}
                        className="flex items-center"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm" 
                        onClick={() => onDelete(project.id as string)}
                        className="flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm" 
                        onClick={() => onView(project.id as string)}
                        className="flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProjectsTable;
