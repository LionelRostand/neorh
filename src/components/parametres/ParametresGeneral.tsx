
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ParametresGeneral = () => {
  return (
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
  );
};

export default ParametresGeneral;
