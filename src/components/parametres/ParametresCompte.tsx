
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { Employee } from "@/types/employee";
import { Save, Eye, EyeOff, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import ChangePasswordForm from "./ChangePasswordForm";

const ParametresCompte = () => {
  const { employees, isLoading } = useEmployeeData();
  const { user } = useAuth();
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

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

  const savePassword = (employee: Employee) => {
    const password = passwords[employee.id];
    if (!password) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un mot de passe",
        variant: "destructive"
      });
      return;
    }

    // Ici vous pourriez implémenter la logique de sauvegarde du mot de passe
    // Par exemple, envoyer vers une API ou stocker dans Firebase
    console.log(`Mot de passe défini pour ${employee.name}: ${password}`);
    
    toast({
      title: "Succès",
      description: `Mot de passe défini pour ${employee.name}`,
    });
  };

  const generateRandomPassword = (employeeId: string) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    handlePasswordChange(employeeId, password);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Mon compte</CardTitle>
            <CardDescription>Chargement...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mon compte</CardTitle>
          <CardDescription>
            Gérez les informations de votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Profil</h3>
              <p className="text-sm text-gray-500">Modifier vos informations personnelles</p>
            </div>
            <Button variant="outline">Modifier</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Suppression du compte</h3>
              <p className="text-sm text-gray-500">Supprimer définitivement votre compte</p>
            </div>
            <Button variant="destructive">Supprimer</Button>
          </div>
        </CardContent>
      </Card>

      {/* Password change form for employees */}
      <ChangePasswordForm />

      {/* Employee password management for admins */}
      {user?.isAdmin && (
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
                  <div key={employee.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{employee.name}</h4>
                        <p className="text-sm text-gray-500">
                          {employee.position} - {employee.department}
                        </p>
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
                            type={showPasswords[employee.id] ? "text" : "password"}
                            value={passwords[employee.id] || ""}
                            onChange={(e) => handlePasswordChange(employee.id, e.target.value)}
                            placeholder="Saisir un mot de passe"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                            onClick={() => togglePasswordVisibility(employee.id)}
                          >
                            {showPasswords[employee.id] ? (
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
                          onClick={() => generateRandomPassword(employee.id)}
                        >
                          Générer
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => savePassword(employee)}
                          className="flex items-center gap-1"
                        >
                          <Save className="h-4 w-4" />
                          Sauvegarder
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ParametresCompte;
