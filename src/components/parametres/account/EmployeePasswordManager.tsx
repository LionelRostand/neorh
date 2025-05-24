
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { Employee } from "@/types/employee";
import { createEmployeeAccount } from "@/services/employeeAuthService";
import PasswordField from "./PasswordField";

const EmployeePasswordManager = () => {
  const { employees, isLoading } = useEmployeeData();
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [savingPasswords, setSavingPasswords] = useState<Record<string, boolean>>({});

  const handlePasswordChange = (employeeId: string, password: string) => {
    setPasswords(prev => ({
      ...prev,
      [employeeId]: password
    }));
  };

  const togglePasswordVisibility = (employeeId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [employeeId]: !prev[employeeId]
    }));
  };

  const savePassword = async (employee: Employee) => {
    const password = passwords[employee.id];
    if (!password) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un mot de passe",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive"
      });
      return;
    }

    if (!employee.email) {
      toast({
        title: "Erreur",
        description: "L'employé doit avoir une adresse email",
        variant: "destructive"
      });
      return;
    }

    setSavingPasswords(prev => ({ ...prev, [employee.id]: true }));

    try {
      const result = await createEmployeeAccount({
        employeeId: employee.id,
        email: employee.email,
        password: password
      });

      if (result.success) {
        toast({
          title: "Succès",
          description: `Mot de passe défini pour ${employee.name}`,
        });

        setPasswords(prev => {
          const newPasswords = { ...prev };
          delete newPasswords[employee.id];
          return newPasswords;
        });
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors de la création du compte",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving password:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive"
      });
    } finally {
      setSavingPasswords(prev => ({ ...prev, [employee.id]: false }));
    }
  };

  const generateRandomPassword = (employeeId: string) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    handlePasswordChange(employeeId, password);
  };

  if (isLoading) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Gestion des mots de passe employés
        </CardTitle>
        <CardDescription>
          Attribuez un mot de passe par défaut à chaque employé
        </CardDescription>
      </CardHeader>
      <CardContent>
        {employees.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun employé trouvé</p>
          </div>
        ) : (
          <div className="space-y-4">
            {employees.map((employee) => (
              <PasswordField
                key={employee.id}
                employee={employee}
                password={passwords[employee.id] || ""}
                showPassword={showPasswords[employee.id] || false}
                isSaving={savingPasswords[employee.id] || false}
                onPasswordChange={handlePasswordChange}
                onToggleVisibility={togglePasswordVisibility}
                onGenerateRandom={generateRandomPassword}
                onSave={savePassword}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeePasswordManager;
