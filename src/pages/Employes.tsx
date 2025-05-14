
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import EmployeesProfiles from '@/components/employees/EmployeesProfiles';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useEmployeeData } from '@/hooks/useEmployeeData';

const Employes = () => {
  const [activeTab, setActiveTab] = useState("liste");
  const { employees, isLoading, error } = useEmployeeData();
  
  if (error) {
    toast({
      title: "Erreur de chargement",
      description: "Impossible de charger les données des employés",
      variant: "destructive"
    });
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Employés</h1>
        <p className="text-gray-500">Gestion complète des profils employés et de leurs informations</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gestion des employés</CardTitle>
          <CardDescription>
            Cette section permet la gestion complète des profils employés avec leurs informations personnelles et professionnelles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="liste" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="liste">Liste des employés</TabsTrigger>
              <TabsTrigger value="ajouter">Ajouter un employé</TabsTrigger>
              <TabsTrigger value="import">Importer des données</TabsTrigger>
              <TabsTrigger value="export">Exporter des données</TabsTrigger>
            </TabsList>
            
            <TabsContent value="liste">
              <EmployeesProfiles 
                employees={employees} 
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="ajouter">
              <div className="text-center p-8">
                <p>Le formulaire d'ajout d'employé sera implémenté ici</p>
              </div>
            </TabsContent>

            <TabsContent value="import">
              <div className="text-center p-8">
                <p>L'importation des données sera implémentée ici</p>
              </div>
            </TabsContent>

            <TabsContent value="export">
              <div className="text-center p-8">
                <p>L'exportation des données sera implémentée ici</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Employes;
