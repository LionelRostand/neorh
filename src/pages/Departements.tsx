
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ContractStatusCards from "@/components/contracts/ContractStatusCards";
import { Department } from "@/types/firebase";
import { useDepartmentsData } from "@/hooks/useDepartmentsData";
import NewDepartmentDialog from "@/components/departments/NewDepartmentDialog";
import EditDepartmentDialog from "@/components/departments/EditDepartmentDialog";
import DeleteDepartmentConfirmDialog from "@/components/departments/DeleteDepartmentConfirmDialog";
import ViewDepartmentDialog from "@/components/departments/ViewDepartmentDialog";

const Departements = () => {
  const { toast } = useToast();
  const { departments, isLoading, error, refetch } = useDepartmentsData();
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    expired: 0
  });

  // Update stats when departments change
  useEffect(() => {
    if (departments) {
      setStats({
        total: departments.length,
        active: departments.length, // Assuming all departments are active for now
        pending: 0,
        expired: 0
      });
    }
  }, [departments]);

  const handleNewDepartment = () => {
    setIsNewDialogOpen(true);
  };

  const handleEdit = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (department) {
      setSelectedDepartment(department);
      setIsEditDialogOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Département non trouvé"
      });
    }
  };

  const handleDelete = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (department) {
      setSelectedDepartment(department);
      setIsDeleteDialogOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Département non trouvé"
      });
    }
  };

  const handleView = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (department) {
      setSelectedDepartment(department);
      setIsViewDialogOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Département non trouvé"
      });
    }
  };

  // Fonction pour simplifier les IDs et les rendre plus faciles à retenir
  const getSimplifiedId = (id: string | undefined): string => {
    if (!id) return "-";
    // Prendre seulement les 8 premiers caractères
    return id.substring(0, 8);
  };

  console.log("Departments loaded:", departments);

  return (
    <div className="space-y-6">
      {/* Header with title and button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des départements</h1>
        <Button onClick={handleNewDepartment}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau
        </Button>
      </div>

      {/* Status Cards */}
      <ContractStatusCards
        total={stats.total}
        active={stats.active}
        pending={stats.pending}
        expired={stats.expired}
      />

      {/* Departments table */}
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
                          onClick={() => handleEdit(department.id as string)}
                          className="flex items-center"
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm" 
                          onClick={() => handleDelete(department.id as string)}
                          className="flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm" 
                          onClick={() => handleView(department.id as string)}
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

      {/* Debug info - helps troubleshoot during development */}
      <div className="text-xs text-gray-500 mt-4">
        Nombre de départements: {departments.length}
      </div>

      {/* New Department Dialog */}
      <NewDepartmentDialog
        open={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
        onSuccess={refetch}
      />

      {/* Edit Department Dialog */}
      <EditDepartmentDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        department={selectedDepartment}
        onSuccess={refetch}
      />

      {/* Delete Department Confirm Dialog */}
      <DeleteDepartmentConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        department={selectedDepartment}
        onSuccess={refetch}
      />

      {/* View Department Dialog */}
      <ViewDepartmentDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        department={selectedDepartment}
      />
    </div>
  );
};

export default Departements;
