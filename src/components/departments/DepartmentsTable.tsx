
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

  console.log("DepartmentsTable rendering with:", {
    departmentsCount: departments?.length,
    isLoading,
    hasError: !!error
  });

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
              <TableHead className="w-[240px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                    <span>Chargement des départements...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-red-500">
                  <div className="flex flex-col items-center">
                    <svg className="h-10 w-10 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Erreur: {error.message}</span>
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
                      Réessayer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <div className="flex flex-col items-center">
                    <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-lg font-medium mb-1">Aucun département trouvé</span>
                    <p className="text-gray-500 mb-4">Commencez par créer un nouveau département</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              departments.map((department) => (
                <TableRow key={department.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm">
                    <span title={department.id} className="cursor-help">
                      {getSimplifiedId(department.id)}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: department.color || '#6B7280' }}
                      ></div>
                      {department.name}
                    </div>
                  </TableCell>
                  <TableCell>{department.description || '-'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline"
                        size="sm" 
                        onClick={() => onView(department.id as string)}
                        className="flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
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
                        className="flex items-center text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
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
