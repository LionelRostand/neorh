
import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Pen, Check, Trash2 } from "lucide-react";
import { Permission } from "./types";

interface PermissionsTableProps {
  permissions: Permission[];
  isLoading: boolean;
  onPermissionChange: (menuIndex: number, permissionType: keyof Omit<Permission, 'id' | 'menuName' | 'employeeId'>, value: boolean) => void;
}

const PermissionsTable = ({ permissions, isLoading, onPermissionChange }: PermissionsTableProps) => {
  return (
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
                    onPermissionChange(index, 'canView', checked === true)
                  }
                  disabled={isLoading}
                />
              </TableCell>
              <TableCell className="text-center">
                <Checkbox
                  checked={permission.canCreate}
                  disabled={!permission.canView || isLoading}
                  onCheckedChange={(checked) => 
                    onPermissionChange(index, 'canCreate', checked === true)
                  }
                />
              </TableCell>
              <TableCell className="text-center">
                <Checkbox
                  checked={permission.canEdit}
                  disabled={!permission.canView || isLoading}
                  onCheckedChange={(checked) => 
                    onPermissionChange(index, 'canEdit', checked === true)
                  }
                />
              </TableCell>
              <TableCell className="text-center">
                <Checkbox
                  checked={permission.canDelete}
                  disabled={!permission.canView || isLoading}
                  onCheckedChange={(checked) => 
                    onPermissionChange(index, 'canDelete', checked === true)
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PermissionsTable;
