
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Settings, Bell, Lock, User, ShieldAlert } from "lucide-react";

const Parametres = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
        <p className="text-gray-500">Gérez les paramètres de votre application</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
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
          <TabsTrigger value="database">
            <ShieldAlert className="h-4 w-4 mr-2" />
            Base de données
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
              <CardTitle>Règles de sécurité Firestore</CardTitle>
              <CardDescription>
                Ces règles définissent qui peut lire et écrire dans votre base de données Firestore.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription className="flex items-start gap-2">
                  <ShieldAlert className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-red-800">
                    <strong>ATTENTION:</strong> Ces règles sont configurées pour le développement uniquement et permettent un accès complet à la base de données. NE PAS UTILISER EN PRODUCTION.
                  </span>
                </AlertDescription>
              </Alert>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Comment appliquer ces règles :</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Accédez à la console Firebase (https://console.firebase.google.com/)</li>
                  <li>Sélectionnez votre projet</li>
                  <li>Dans le menu de gauche, cliquez sur 'Firestore Database'</li>
                  <li>Cliquez sur l'onglet 'Rules'</li>
                  <li>Remplacez les règles existantes par celles fournies ci-dessous</li>
                  <li>Cliquez sur 'Publier'</li>
                </ol>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Code des règles Firestore</h3>
                <div className="p-4 bg-gray-100 rounded-md">
                  <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                  </pre>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Règles de sécurité recommandées</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="production">
                    <AccordionTrigger className="text-md">
                      Règles pour la production
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 bg-gray-100 rounded-md mt-2">
                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Authentification requise pour toutes les opérations
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Règles spécifiques pour la collection 'employees'
    match /employees/{employeeId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && 
                             (request.resource.data.managerId == request.auth.uid || 
                              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow delete: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}`}
                        </pre>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de la base de données</CardTitle>
              <CardDescription>
                Gérez les paramètres de votre base de données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Sauvegarde automatique</h3>
                  <p className="text-sm text-gray-500">Configurer les sauvegardes automatiques de la base de données</p>
                </div>
                <Button variant="outline">Configurer</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Indexation</h3>
                  <p className="text-sm text-gray-500">Gérer les index de la base de données</p>
                </div>
                <Button variant="outline">Gérer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Parametres;
