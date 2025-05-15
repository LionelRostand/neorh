
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings, Bell, Lock, User } from "lucide-react";

const Parametres = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
        <p className="text-gray-500">Gérez les paramètres de votre application</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            Général
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="h-4 w-4 mr-2" />
            Compte
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les paramètres généraux de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Mode sombre</h3>
                  <p className="text-sm text-gray-500">Activer le thème sombre pour l'interface</p>
                </div>
                <Button variant="outline">Désactivé</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Langue</h3>
                  <p className="text-sm text-gray-500">Langue de l'interface</p>
                </div>
                <Button variant="outline">Français</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notifications</CardTitle>
              <CardDescription>
                Configurez vos préférences de notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
                </div>
                <Button variant="outline">Activé</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notifications push</h3>
                  <p className="text-sm text-gray-500">Recevoir des notifications push</p>
                </div>
                <Button variant="outline">Activé</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>
                Gérez vos paramètres de sécurité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Authentification à deux facteurs</h3>
                  <p className="text-sm text-gray-500">Sécurisez votre compte avec l'authentification à deux facteurs</p>
                </div>
                <Button variant="outline">Configurer</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Changer de mot de passe</h3>
                  <p className="text-sm text-gray-500">Modifier votre mot de passe actuel</p>
                </div>
                <Button variant="outline">Modifier</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Parametres;
