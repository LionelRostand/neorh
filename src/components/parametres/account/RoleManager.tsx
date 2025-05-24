
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, Shield, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RoleManagerProps {
  userId?: string;
  userEmail?: string;
}

const RoleManager: React.FC<RoleManagerProps> = ({ userId, userEmail }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const targetUserId = userId || user?.uid;
  const targetUserEmail = userEmail || user?.email;

  useEffect(() => {
    const loadUserRoles = async () => {
      if (!targetUserId) return;

      try {
        setLoading(true);
        
        // Vérifier si c'est l'admin par email
        if (targetUserEmail === 'admin@neotech-consulting.com') {
          setIsAdmin(true);
        } else {
          // Vérifier dans le profil utilisateur
          const userProfileRef = doc(db, 'user_profiles', targetUserId);
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
        toast({
          title: "Erreur",
          description: "Impossible de charger les rôles de l'utilisateur.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserRoles();
  }, [targetUserId, targetUserEmail, toast]);

  const handleSaveRoles = async () => {
    if (!targetUserId) return;

    try {
      setSaving(true);

      // Ne pas permettre la modification des rôles de l'admin principal
      if (targetUserEmail === 'admin@neotech-consulting.com') {
        toast({
          title: "Non autorisé",
          description: "Les rôles de l'administrateur principal ne peuvent pas être modifiés.",
          variant: "destructive",
        });
        return;
      }

      // Mettre à jour le profil utilisateur
      const userProfileRef = doc(db, 'user_profiles', targetUserId);
      await updateDoc(userProfileRef, {
        isAdmin,
        role: isAdmin ? 'admin' : 'user',
        updatedAt: new Date().toISOString()
      });

      toast({
        title: "Succès",
        description: "Les rôles ont été mis à jour avec succès.",
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestion des rôles
          </CardTitle>
          <CardDescription>
            Attribuez les rôles appropriés à ce compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Chargement des rôles...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Gestion des rôles
        </CardTitle>
        <CardDescription>
          Attribuez les rôles appropriés à ce compte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 border rounded-lg">
            <Checkbox
              id="admin-role"
              checked={isAdmin}
              onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
              disabled={targetUserEmail === 'admin@neotech-consulting.com'}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <label htmlFor="admin-role" className="font-medium cursor-pointer">
                  Administrateur
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Accès complet à toutes les fonctionnalités de l'application
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 border rounded-lg bg-gray-50">
            <Checkbox
              id="user-role"
              checked={!isAdmin}
              disabled={true}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-green-600" />
                <label htmlFor="user-role" className="font-medium">
                  Utilisateur
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Accès standard aux fonctionnalités selon les permissions attribuées
              </p>
            </div>
          </div>
        </div>

        {targetUserEmail === 'admin@neotech-consulting.com' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Les rôles de l'administrateur principal ne peuvent pas être modifiés.
            </p>
          </div>
        )}

        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            <strong>Info:</strong> Les employés peuvent se connecter avec leur mot de passe par défaut généré dans la section "Gestion des mots de passe employés" ci-dessous.
          </p>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSaveRoles}
            disabled={saving || targetUserEmail === 'admin@neotech-consulting.com'}
            className="flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Sauvegarde..." : "Sauvegarder les rôles"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleManager;
