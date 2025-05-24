
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Save, Loader2 } from "lucide-react";
import { Employee } from "@/types/employee";

interface PasswordFieldProps {
  employee: Employee;
  password: string;
  showPassword: boolean;
  isSaving: boolean;
  onPasswordChange: (employeeId: string, password: string) => void;
  onToggleVisibility: (employeeId: string) => void;
  onGenerateRandom: (employeeId: string) => void;
  onSave: (employee: Employee) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  employee,
  password,
  showPassword,
  isSaving,
  onPasswordChange,
  onToggleVisibility,
  onGenerateRandom,
  onSave
}) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-medium">{employee.name}</h4>
          <div className="text-sm text-gray-500 space-y-1">
            <p>{employee.position}</p>
            {employee.department && (
              <p className="font-medium text-blue-600">{employee.department}</p>
            )}
          </div>
          {employee.email && (
            <p className="text-sm text-blue-600 mt-1">{employee.email}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div className="md:col-span-2">
          <Label htmlFor={`password-${employee.id}`}>
            Mot de passe par défaut
          </Label>
          <div className="relative mt-1">
            <Input
              id={`password-${employee.id}`}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => onPasswordChange(employee.id, e.target.value)}
              placeholder="Saisir un mot de passe"
              disabled={isSaving}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => onToggleVisibility(employee.id)}
              disabled={isSaving}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onGenerateRandom(employee.id)}
            disabled={isSaving}
          >
            Générer
          </Button>
          <Button
            size="sm"
            onClick={() => onSave(employee)}
            disabled={isSaving || !password}
            className="flex items-center gap-1"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasswordField;
