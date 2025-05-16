
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
import { Department } from "@/types/firebase";
import { useToast } from "@/hooks/use-toast";

interface DepartmentsTableProps {
  departments: Department[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (departmentId: string) => void;
  onDelete: (departmentId: string) => void;
  onView: (departmentId: string) => void;
}

const DepartmentsTable: React.FC<DepartmentsTableProps> = ({
  departments,
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
        <h2 className="text-lg font-medium">Liste des départements</h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Chargement des départements...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-red-500">
                  Erreur: {error.message}
                </TableCell>
              </TableRow>
            ) : departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Aucun département trouvé
                </TableCell>
              </TableRow>
            ) : (
              departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-mono text-sm">
                    <span title={department.id} className="cursor-help">
                      {getSimplifiedId(department.id)}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{department.name}</TableCell>
                  <TableCell>{department.description || '-'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline"
                        size="sm" 
                        onClick={() => onEdit(department.id as string)}
                        className="flex items-center"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm" 
                        onClick={() => onDelete(department.id as string)}
                        className="flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm" 
                        onClick={() => onView(department.id as string)}
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

export default DepartmentsTable;
