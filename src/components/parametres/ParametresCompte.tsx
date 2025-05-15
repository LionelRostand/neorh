
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ParametresCompte = () => {
  return (
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
  );
};

export default ParametresCompte;
