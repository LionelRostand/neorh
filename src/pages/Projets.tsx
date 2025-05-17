
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Projets = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Projets</h1>
        <div className="flex items-center space-x-2">
          <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
            Nouveau Projet
          </button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projets</CardTitle>
          <CardDescription>
            Gérez tous les projets de votre organisation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Liste des projets à venir...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Projets;
