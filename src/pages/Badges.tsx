
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Badges = () => {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Badges et accès</h1>
        <p className="text-gray-500">Gestion des badges d'identification et des droits d'accès</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des badges</CardTitle>
          <CardDescription>
            Cette section permet de gérer les badges d'identification et les droits d'accès des employés aux différentes installations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Contenu à venir pour la gestion des badges et accès.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Badges;
