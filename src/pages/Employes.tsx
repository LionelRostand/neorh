
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Employes = () => {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Employés</h1>
        <p className="text-gray-500">Gestion complète des profils employés et de leurs informations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des employés</CardTitle>
          <CardDescription>
            Cette section permet la gestion complète des profils employés avec leurs informations personnelles et professionnelles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Contenu à venir pour la gestion des employés.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Employes;
