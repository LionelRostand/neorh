
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ParametresTabs from "@/components/parametres/ParametresTabs";
import ParametresGeneral from "@/components/parametres/ParametresGeneral";
import ParametresNotifications from "@/components/parametres/ParametresNotifications";
import ParametresSecurite from "@/components/parametres/ParametresSecurite";
import ParametresCompte from "@/components/parametres/ParametresCompte";
import ParametresFirebase from "@/components/parametres/ParametresFirebase";

const Parametres = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
        <p className="text-gray-500">Gérez les paramètres de votre application</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <ParametresTabs />
        
        <TabsContent value="general" className="space-y-4">
          <ParametresGeneral />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <ParametresNotifications />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <ParametresSecurite />
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <ParametresCompte />
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <ParametresFirebase />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Parametres;
