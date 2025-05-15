
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useFirestore } from "@/hooks/firestore";
import { Shield, Eye, Pen, Check, Trash2, UserCog } from "lucide-react";
import { Employee } from "@/types/firebase";

type Permission = {
  id?: string;
  menuName: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  employeeId: string;
};

const menuItems = [
  "Tableau de bord",
  "Employés",
  "Badges et accès",
  "Hiérarchie",
  "Présences",
  "Feuilles de temps",
  "Congés",
  "Contrats",
  "Documents RH",
  "Départements",
  "Évaluations",
  "Formations",
  "Salaires",
  "Recrutement",
  "Entreprises",
  "Rapports",
  "Paramètres"
];

const ParametresPermissions = () => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { getAll, add, update, search } = useFirestore<Permission>('permissions');
  const employeesFirestore = useFirestore<Employee>('employees');
  
  // Charger la liste des employés
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setIsLoading(true);
        const employeesResult = await employeesFirestore.getAll();
        // Fix error: Use docs property from QueryResult
        setEmployees(employeesResult.docs);
        
        // Si des employés sont trouvés, sélectionner le premier par défaut
        if (employeesResult.docs.length > 0) {
          setSelectedEmployeeId(employeesResult.docs[0].id);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des employés:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des employés",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEmployees();
  }, []);

  // Charger les permissions quand un employé est sélectionné
  useEffect(() => {
    if (!selectedEmployeeId) return;
    
    const loadPermissions = async () => {
      try {
        setIsLoading(true);
        // Fix error: Add correct parameters to search
        const permissionsResult = await search("employeeId", selectedEmployeeId, {
          exactMatch: true
        });
        
        if (permissionsResult.docs.length > 0) {
          // Fix error: Use docs property from QueryResult
          setPermissions(permissionsResult.docs);
        } else {
          // Créer des permissions par défaut pour le nouvel employé
          const defaultPermissions = menuItems.map(menu => ({
            menuName: menu,
            canView: menu === "Tableau de bord", // Par défaut, seule la visualisation du tableau de bord est permise
            canCreate: false,
            canEdit: false,
            canDelete: false,
            employeeId: selectedEmployeeId
          }));
          setPermissions(defaultPermissions);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des permissions:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les permissions de l'employé",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPermissions();
  }, [selectedEmployeeId]);

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
  };
  
  const handlePermissionChange = (menuIndex: number, permissionType: keyof Omit<Permission, 'id' | 'menuName' | 'employeeId'>, value: boolean) => {
    setPermissions(prev => {
      const newPermissions = [...prev];
      newPermissions[menuIndex] = {
        ...newPermissions[menuIndex],
        [permissionType]: value
      };
      
      // Si canView est décoché, décocher toutes les autres permissions
      if (permissionType === 'canView' && !value) {
        newPermissions[menuIndex].canCreate = false;
        newPermissions[menuIndex].canEdit = false;
        newPermissions[menuIndex].canDelete = false;
      }
      
      // Si une autre permission est cochée, s'assurer que canView est aussi coché
      if (permissionType !== 'canView' && value) {
        newPermissions[menuIndex].canView = true;
      }
      
      return newPermissions;
    });
  };

  const savePermissions = async () => {
    if (!selectedEmployeeId) {
      toast({
        title: "Erreur",
        description: "Aucun employé sélectionné",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      for (const permission of permissions) {
        if (permission.id) {
          await update(permission.id, permission);
        } else {
          await add(permission);
        }
      }
      
      toast({
        title: "Succès",
        description: "Les permissions ont été enregistrées avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des permissions",
        variant: "destructive"
      });
      console.error("Error saving permissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployeeName = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? `${employee.firstName} ${employee.lastName}` : "Employé inconnu";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" /> 
          Gestion des permissions par employé
        </CardTitle>
        <CardDescription>
          Définissez les droits d'accès aux différentes fonctionnalités pour chaque employé du module RH.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <label htmlFor="employee-select" className="block text-sm font-medium mb-2 flex items-center gap-2">
            <UserCog className="h-4 w-4" /> Sélectionner un employé
          </label>
          <Select 
            value={selectedEmployeeId} 
            onValueChange={handleEmployeeChange}
            disabled={isLoading || employees.length === 0}
          >
            <SelectTrigger className="w-full md:w-80">
              <SelectValue placeholder="Sélectionner un employé" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName} - {employee.position || "Sans poste"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedEmployeeId && (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Menu</TableHead>
                    <TableHead className="text-center">
                      <div className="flex flex-col items-center">
                        <Eye className="h-4 w-4 mb-1" />
                        Visualiser
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex flex-col items-center">
                        <Check className="h-4 w-4 mb-1" />
                        Créer
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex flex-col items-center">
                        <Pen className="h-4 w-4 mb-1" />
                        Modifier
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex flex-col items-center">
                        <Trash2 className="h-4 w-4 mb-1" />
                        Supprimer
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission, index) => (
                    <TableRow key={permission.menuName}>
                      <TableCell className="font-medium">{permission.menuName}</TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={permission.canView}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(index, 'canView', checked === true)
                          }
                          disabled={isLoading}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={permission.canCreate}
                          disabled={!permission.canView || isLoading}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(index, 'canCreate', checked === true)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={permission.canEdit}
                          disabled={!permission.canView || isLoading}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(index, 'canEdit', checked === true)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={permission.canDelete}
                          disabled={!permission.canView || isLoading}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(index, 'canDelete', checked === true)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={savePermissions} 
                disabled={isLoading || !selectedEmployeeId}
              >
                {isLoading ? "Enregistrement..." : "Enregistrer les permissions"}
              </Button>
            </div>
          </>
        )}

        {employees.length === 0 && (
          <div className="p-4 bg-amber-50 text-amber-800 rounded-md">
            Aucun employé n'a été trouvé. Veuillez d'abord ajouter des employés dans le module Employés.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParametresPermissions;
