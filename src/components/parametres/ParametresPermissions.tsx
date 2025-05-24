
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Plus, Edit, Trash2, User, Save } from "lucide-react";
import { navItems } from "@/components/sidebar/NavItems";
import { usePermissionsManager } from "./permissions/usePermissionsManager";
import EmptyStateMessage from "./permissions/EmptyStateMessage";
import EmployeeRolePermissions from "./permissions/EmployeeRolePermissions";

const ParametresPermissions = () => {
  const {
    selectedEmployeeId,
    employees,
    permissions,
    isLoading,
    handleEmployeeChange,
    handlePermissionChange,
    savePermissions,
    getEmployeeName
  } = usePermissionsManager();

  if (employees.length === 0 && !isLoading) {
    return <EmptyStateMessage />;
  }

  return (
    <div className="space-y-6">
      {/* Gestion des rôles employés */}
      <EmployeeRolePermissions />

      {/* Gestion des permissions par module */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Gestion des permissions par module
          </CardTitle>
          <CardDescription>
            Configurez les droits d'accès pour chaque employé sur les différents modules de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélection de l'employé */}
          <div className="flex items-center gap-4">
            <label htmlFor="employee-select" className="text-sm font-medium min-w-fit">
              Employé :
            </label>
            <Select 
              value={selectedEmployeeId || "no-selection"} 
              onValueChange={handleEmployeeChange}
              disabled={isLoading || employees.length === 0}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id || "employee-unknown"}>
                    {employee.name} - {employee.position || "Sans poste"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tableau des permissions */}
          {selectedEmployeeId && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-medium text-gray-900">
                  Permissions pour {getEmployeeName(selectedEmployeeId)}
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        Menu
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                        <div className="flex items-center justify-center gap-1">
                          <Eye className="h-4 w-4" />
                          Visualiser
                        </div>
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                        <div className="flex items-center justify-center gap-1">
                          <Plus className="h-4 w-4" />
                          Créer
                        </div>
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                        <div className="flex items-center justify-center gap-1">
                          <Edit className="h-4 w-4" />
                          Modifier
                        </div>
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                        <div className="flex items-center justify-center gap-1">
                          <Trash2 className="h-4 w-4" />
                          Supprimer
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {navItems
                      .filter(item => item.title !== "Paramètres")
                      .map((navItem, index) => {
                        const permission = permissions.find(p => p.menuName === navItem.title);
                        const permissionIndex = permissions.findIndex(p => p.menuName === navItem.title);
                        
                        return (
                          <tr key={navItem.title} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {navItem.icon}
                                <span className="font-medium">{navItem.title}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Checkbox
                                checked={permission?.canView || false}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(permissionIndex, 'canView', !!checked)
                                }
                                disabled={isLoading}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Checkbox
                                checked={permission?.canCreate || false}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(permissionIndex, 'canCreate', !!checked)
                                }
                                disabled={isLoading}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Checkbox
                                checked={permission?.canEdit || false}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(permissionIndex, 'canEdit', !!checked)
                                }
                                disabled={isLoading}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Checkbox
                                checked={permission?.canDelete || false}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(permissionIndex, 'canDelete', !!checked)
                                }
                                disabled={isLoading}
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              
              <div className="px-4 py-3 bg-gray-50 border-t">
                <Button 
                  onClick={savePermissions}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Enregistrer les permissions
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ParametresPermissions;
