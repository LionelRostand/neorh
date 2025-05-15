
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShieldAlert } from "lucide-react";

const ParametresSecurite = () => {
  return (
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
  );
};

export default ParametresSecurite;
