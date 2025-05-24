
import React from 'react';
import { Employee } from '@/types/employee';
import PasswordField from '../../parametres/account/PasswordField';
import { useState } from 'react';
import { createEmployeeAccount } from '@/services/employeeAuthService';
import { useToast } from '@/hooks/use-toast';

interface EmployeeRolesAndAuthProps {
  employee: Employee;
  onRefresh?: () => void;
}

const EmployeeRolesAndAuth: React.FC<EmployeeRolesAndAuthProps> = ({ 
  employee, 
  onRefresh 
}) => {
  const { toast } = useToast();
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Gestion du mot de passe</h3>
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
          <p className="text-sm text-green-700">
            <strong>Info:</strong> Définissez un mot de passe par défaut pour permettre à cet employé de se connecter à l'application.
          </p>
        </div>
        
        <PasswordField
          employee={employee}
          password={passwords[employee.id] || ""}
          showPassword={showPasswords[employee.id] || false}
          isSaving={savingPasswords[employee.id] || false}
          onPasswordChange={handlePasswordChange}
          onToggleVisibility={togglePasswordVisibility}
          onGenerateRandom={generateRandomPassword}
          onSave={savePassword}
        />
      </div>
    </div>
  );
};

export default EmployeeRolesAndAuth;
