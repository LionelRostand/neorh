
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, User, Save, Loader2, Key } from "lucide-react";
import { Employee } from "@/types/employee";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { createEmployeeAccount } from "@/services/employeeAuthService";
import PasswordField from "../account/PasswordField";

const EmployeeRolePermissions = () => {
  const { employees, isLoading: employeesLoading } = useEmployeeData();
  const { toast } = useToast();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [savingPasswords, setSavingPasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (selectedEmployeeId && employees.length > 0) {
      const employee = employees.find(emp => emp.id === selectedEmployeeId);
      setSelectedEmployee(employee || null);
      
      if (employee) {
        loadEmployeeRoles(employee);
      }
    }
  }, [selectedEmployeeId, employees]);

  const loadEmployeeRoles = async (employee: Employee) => {
    if (!employee.id) return;

    try {
      setLoading(true);
      
      if (employee.email === 'admin@neotech-consulting.com') {
        setIsAdmin(true);
      } else {
        const userProfileRef = doc(db, 'user_profiles', employee.id);
        const userProfileSnap = await getDoc(userProfileRef);
        
        if (userProfileSnap.exists()) {
          const profileData = userProfileSnap.data();
          setIsAdmin(profileData.isAdmin || false);
        } else {
          setIsAdmin(false);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rôles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoles = async () => {
    if (!selectedEmployee?.id) return;

    try {
      setSaving(true);

      if (selectedEmployee.email === 'admin@neotech-consulting.com') {
        toast({
          title: "Non autorisé",
          description: "Les rôles de l'administrateur principal ne peuvent pas être modifiés.",
          variant: "destructive",
        });
        return;
      }

      const userProfileRef = doc(db, 'user_profiles', selectedEmployee.id);
      await updateDoc(userProfileRef, {
        isAdmin,
        role: isAdmin ? 'admin' : 'user',
        updatedAt: new Date().toISOString()
      });

      toast({
        title: "Succès",
        description: `Rôles mis à jour pour ${selectedEmployee.name}`,
      });

    } catch (error) {
      console.error('Erreur lors de la sauvegarde des rôles:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les rôles.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

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

  const generateRandomPassword = (employeeId: string) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    handlePasswordChange(employeeId, password);
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

  if (employeesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Gestion des rôles employés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Chargement...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Gestion des rôles employés
        </CardTitle>
        <CardDescription>
          Attribuez des rôles et gérez les accès pour chaque employé
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
            onValueChange={setSelectedEmployeeId}
            disabled={employeesLoading || employees.length === 0}
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

        {/* Gestion des rôles */}
        {selectedEmployee && (
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4">Attribution des rôles</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={`admin-role-${selectedEmployee.id}`}
                    checked={isAdmin}
                    onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
                    disabled={selectedEmployee.email === 'admin@neotech-consulting.com' || loading}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <label htmlFor={`admin-role-${selectedEmployee.id}`} className="font-medium cursor-pointer">
                        Administrateur
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Accès complet à toutes les fonctionnalités de l'application
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50">
                  <Checkbox
                    id={`user-role-${selectedEmployee.id}`}
                    checked={!isAdmin}
                    disabled={true}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
                      <label htmlFor={`user-role-${selectedEmployee.id}`} className="font-medium">
                        Utilisateur
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Accès standard aux fonctionnalités selon les permissions attribuées
                    </p>
                  </div>
                </div>
              </div>

              {selectedEmployee.email === 'admin@neotech-consulting.com' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mt-3">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Les rôles de l'administrateur principal ne peuvent pas être modifiés.
                  </p>
                </div>
              )}

              <div className="flex justify-end mt-4">
                <Button 
                  onClick={handleSaveRoles}
                  disabled={saving || selectedEmployee.email === 'admin@neotech-consulting.com'}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>
            </div>

            {/* Gestion du mot de passe */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4">Gestion du mot de passe</h3>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                <p className="text-sm text-green-700">
                  <strong>Info:</strong> Définissez un mot de passe par défaut pour permettre à cet employé de se connecter à l'application.
                </p>
              </div>
              
              <PasswordField
                employee={selectedEmployee}
                password={passwords[selectedEmployee.id] || ""}
                showPassword={showPasswords[selectedEmployee.id] || false}
                isSaving={savingPasswords[selectedEmployee.id] || false}
                onPasswordChange={handlePasswordChange}
                onToggleVisibility={togglePasswordVisibility}
                onGenerateRandom={generateRandomPassword}
                onSave={savePassword}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeRolePermissions;
