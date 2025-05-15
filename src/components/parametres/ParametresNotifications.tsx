
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ParametresNotifications = () => {
  return (
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
  );
};

export default ParametresNotifications;
