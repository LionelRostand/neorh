
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import EmployeeSelector from "./permissions/EmployeeSelector";
import PermissionsTable from "./permissions/PermissionsTable";
import EmptyStateMessage from "./permissions/EmptyStateMessage";
import { usePermissionsManager } from "./permissions/usePermissionsManager";

const ParametresPermissions = () => {
  const {
    selectedEmployeeId,
    employees,
    permissions,
    isLoading,
    handleEmployeeChange,
    handlePermissionChange,
    savePermissions
  } = usePermissionsManager();
  
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
        <EmployeeSelector 
          employees={employees}
          selectedEmployeeId={selectedEmployeeId}
          onEmployeeChange={handleEmployeeChange}
          isLoading={isLoading}
        />

        {selectedEmployeeId && (
          <>
            <PermissionsTable 
              permissions={permissions}
              isLoading={isLoading}
              onPermissionChange={handlePermissionChange}
            />
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

        {employees.length === 0 && <EmptyStateMessage />}
      </CardContent>
    </Card>
  );
};

export default ParametresPermissions;
