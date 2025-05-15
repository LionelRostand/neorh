
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

interface Department {
  id: string;
  name: string;
  description: string;
  manager: string;
  company: string;
  employeesCount: number;
}

const Departements = () => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [stats, setStats] = useState({
    total: 1,
    active: 1,
    pending: 0,
    expired: 0
  });

  // Simuler le chargement des départements
  useEffect(() => {
    // Simuler des données de départements basées sur la capture d'écran
    const mockDepartments: Department[] = [
      {
        id: "95d6215b-8b5c-4247-ad8c-6bbce3313e7e",
        name: "DIRECTION GENERALE",
        description: "gérer par le PDG",
        manager: "N/A",
        company: "NEOTECH-CONSULTING",
        employeesCount: 0
      }
    ];

    setDepartments(mockDepartments);
  }, []);

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
                <TableHead>Manager</TableHead>
                <TableHead>Entreprise</TableHead>
                <TableHead>Employés</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-mono text-xs">{department.id}</TableCell>
                  <TableCell className="font-medium">{department.name}</TableCell>
                  <TableCell>{department.description}</TableCell>
                  <TableCell>{department.manager}</TableCell>
                  <TableCell>{department.company}</TableCell>
                  <TableCell>{department.employeesCount}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline"
                        size="sm" 
                        onClick={() => handleEdit(department.id)}
                        className="flex items-center"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm" 
                        onClick={() => handleDelete(department.id)}
                        className="flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm" 
                        onClick={() => handleManage(department.id)}
                        className="flex items-center"
                      >
                        <Users className="h-4 w-4 mr-1" />
                        Gérer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Departements;
