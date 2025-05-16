
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
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

const Departements = () => {
  const { toast } = useToast();
  const { departments, isLoading, error, refetch } = useDepartmentsData();
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
    toast({
      title: "Nouveau département",
      description: "La création d'un nouveau département sera disponible prochainement."
    });
  };

  const handleEdit = (departmentId: string) => {
    toast({
      title: "Modifier le département",
      description: `Modification du département ${departmentId} à venir.`
    });
  };

  const handleDelete = (departmentId: string) => {
    toast({
      title: "Supprimer le département",
      description: `Suppression du département ${departmentId} à venir.`
    });
  };

  const handleManage = (departmentId: string) => {
    toast({
      title: "Gérer le département",
      description: `Gestion des employés du département ${departmentId} à venir.`
    });
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
                    <TableCell className="font-mono text-xs">{department.id}</TableCell>
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
                          onClick={() => handleManage(department.id as string)}
                          className="flex items-center"
                        >
                          <Users className="h-4 w-4 mr-1" />
                          Gérer
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
    </div>
  );
};

export default Departements;
