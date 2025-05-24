
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, Shield, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Employee } from "@/types/employee";

interface EmployeeRoleManagerProps {
  employee: Employee;
  onRoleUpdate?: () => void;
}

const EmployeeRoleManager: React.FC<EmployeeRoleManagerProps> = ({ 
  employee, 
  onRoleUpdate 
}) => {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadEmployeeRoles = async () => {
      if (!employee.id) return;

      try {
        setLoading(true);
        
        // Vérifier si c'est l'admin par email
        if (employee.email === 'admin@neotech-consulting.com') {
          setIsAdmin(true);
        } else {
          // Vérifier dans le profil utilisateur
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

    loadEmployeeRoles();
  }, [employee.id, employee.email]);

  const handleSaveRoles = async () => {
    if (!employee.id) return;

    try {
      setSaving(true);

      // Ne pas permettre la modification des rôles de l'admin principal
      if (employee.email === 'admin@neotech-consulting.com') {
        toast({
          title: "Non autorisé",
          description: "Les rôles de l'administrateur principal ne peuvent pas être modifiés.",
          variant: "destructive",
        });
        return;
      }

      // Mettre à jour le profil utilisateur
      const userProfileRef = doc(db, 'user_profiles', employee.id);
      await updateDoc(userProfileRef, {
        isAdmin,
        role: isAdmin ? 'admin' : 'user',
        updatedAt: new Date().toISOString()
      });

      toast({
        title: "Succès",
        description: `Rôles mis à jour pour ${employee.name}`,
      });

      if (onRoleUpdate) onRoleUpdate();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2 text-sm">Chargement des rôles...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Gestion des rôles - {employee.name}</h4>
        <span className="text-sm text-gray-500">{employee.email}</span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-3 border rounded-lg">
          <Checkbox
            id={`admin-role-${employee.id}`}
            checked={isAdmin}
            onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
            disabled={employee.email === 'admin@neotech-consulting.com'}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <Label htmlFor={`admin-role-${employee.id}`} className="font-medium cursor-pointer">
                Administrateur
              </Label>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Accès complet à toutes les fonctionnalités de l'application
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50">
          <Checkbox
            id={`user-role-${employee.id}`}
            checked={!isAdmin}
            disabled={true}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-green-600" />
              <Label htmlFor={`user-role-${employee.id}`} className="font-medium">
                Utilisateur
              </Label>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Accès standard aux fonctionnalités selon les permissions attribuées
            </p>
          </div>
        </div>
      </div>

      {employee.email === 'admin@neotech-consulting.com' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Les rôles de l'administrateur principal ne peuvent pas être modifiés.
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleSaveRoles}
          disabled={saving || employee.email === 'admin@neotech-consulting.com'}
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
  );
};

export default EmployeeRoleManager;
