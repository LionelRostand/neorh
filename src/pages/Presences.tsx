
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PresenceKiosk } from "@/components/presence/PresenceKiosk";
import { PresenceRegistry } from "@/components/presence/PresenceRegistry";

const Presences = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Présences</h1>
          <p className="text-muted-foreground">Suivi des entrées et sorties des employés</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exporter
        </Button>
      </div>
      
      <Tabs defaultValue="kiosk" className="w-full">
        <TabsList className="w-full max-w-[600px] bg-white dark:bg-gray-800">
          <TabsTrigger value="kiosk" className="flex-1">Borne de présence</TabsTrigger>
          <TabsTrigger value="registry" className="flex-1">Registre des présences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="kiosk" className="pt-4">
          <PresenceKiosk />
        </TabsContent>
        
        <TabsContent value="registry" className="pt-4">
          <PresenceRegistry />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Presences;
