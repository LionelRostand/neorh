
import React from "react";
import { Eye, Pencil, Trash2, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="shadow-md">
      <CardHeader className="bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium">Liste des départements</CardTitle>
            <CardDescription>Gérez vos départements et leur organisation</CardDescription>
          </div>
          {departments.length > 0 && (
            <Button variant="outline" className="flex items-center gap-1">
              <FilterX className="h-4 w-4" />
              Filtrer
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead className="w-[180px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
                      Chargement des départements...
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-destructive">
                      <span className="font-medium">Erreur:</span>
                      <span>{error.message}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mb-4 text-gray-300"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                      <p className="font-medium text-base mb-1">Aucun département trouvé</p>
                      <p className="text-sm">Créez votre premier département pour démarrer</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((department) => (
                  <TableRow 
                    key={department.id}
                    className="group"
                    style={{
                      borderLeft: department.color ? `4px solid ${department.color}` : `4px solid transparent`
                    }}
                  >
                    <TableCell className="font-mono text-xs">
                      <span 
                        title={department.id} 
                        className="cursor-help bg-gray-100 px-2 py-1 rounded text-gray-500"
                      >
                        {getSimplifiedId(department.id)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{department.name}</div>
                      {department.parentDepartmentId && (
                        <span className="text-xs text-muted-foreground">
                          Sous-département
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {department.description || 
                        <span className="text-muted-foreground italic">Aucune description</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost"
                          size="sm" 
                          onClick={() => onView(department.id as string)}
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Voir les détails</span>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost"
                          size="sm" 
                          onClick={() => onEdit(department.id as string)}
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Modifier</span>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost"
                          size="sm" 
                          onClick={() => onDelete(department.id as string)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <span className="sr-only">Supprimer</span>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      {departments.length > 0 && !isLoading && !error && (
        <CardFooter className="flex justify-between py-3 px-6 border-t bg-gray-50">
          <div className="text-sm text-muted-foreground">
            {departments.length} département{departments.length > 1 ? 's' : ''}
          </div>
          <div className="flex gap-1">
            {/* Pagination pourrait être ajoutée ici si nécessaire */}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default DepartmentsTable;
