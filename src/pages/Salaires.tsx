
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PayrollStatusCards from "@/components/payroll/PayrollStatusCards";
import PayrollFormCard from "@/components/payroll/PayrollFormCard";
import PayrollHistory from "@/components/payroll/PayrollHistory";

const Salaires = () => {
  const [activeTab, setActiveTab] = useState<string>("nouvelle");

  // Mock data for status cards
  const active = 1;
  const pending = 0;
  const archived = 0;
  const coverage = 85;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion des Fiches de Paie</h1>
        <p className="text-muted-foreground mt-2">
          Création et gestion des fiches de paie conformes au Code du travail français
        </p>
      </div>

      <PayrollStatusCards
        active={active}
        pending={pending}
        archived={archived}
        coverage={coverage}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="nouvelle">Nouvelle fiche de paie</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nouvelle" className="mt-6">
          <PayrollFormCard />
        </TabsContent>
        
        <TabsContent value="historique" className="mt-6">
          <PayrollHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Salaires;
