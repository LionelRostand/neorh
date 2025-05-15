
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useFirestore } from "@/hooks/firestore";
import { Shield, Eye, Pen, Check, Trash2 } from "lucide-react";

type Permission = {
  id?: string;
  menuName: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  employeeRole?: string;
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
  const [permissions, setPermissions] = useState<Permission[]>(
    menuItems.map(menu => ({
      menuName: menu,
      canView: true,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      employeeRole: "standard"
    }))
  );
  
  const { add, update } = useFirestore<Permission>('permissions');
  
  const handlePermissionChange = (menuIndex: number, permissionType: keyof Omit<Permission, 'id' | 'menuName' | 'employeeRole'>, value: boolean) => {
    setPermissions(prev => {
      const newPermissions = [...prev];
      newPermissions[menuIndex] = {
        ...newPermissions[menuIndex],
        [permissionType]: value
      };
      
      // If canView is unchecked, uncheck all other permissions
      if (permissionType === 'canView' && !value) {
        newPermissions[menuIndex].canCreate = false;
        newPermissions[menuIndex].canEdit = false;
        newPermissions[menuIndex].canDelete = false;
      }
      
      // If any other permission is checked, make sure canView is also checked
      if (permissionType !== 'canView' && value) {
        newPermissions[menuIndex].canView = true;
      }
      
      return newPermissions;
    });
  };

  const savePermissions = async () => {
    try {
      // This would typically save to Firestore
      // For a real implementation, you'd need to handle batch operations
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
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" /> 
          Gestion des permissions pour les employés
        </CardTitle>
        <CardDescription>
          Définissez les droits d'accès aux différentes fonctionnalités pour les employés du module RH.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={permission.canCreate}
                      disabled={!permission.canView}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(index, 'canCreate', checked === true)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={permission.canEdit}
                      disabled={!permission.canView}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(index, 'canEdit', checked === true)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={permission.canDelete}
                      disabled={!permission.canView}
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
          <Button onClick={savePermissions}>Enregistrer les permissions</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParametresPermissions;
