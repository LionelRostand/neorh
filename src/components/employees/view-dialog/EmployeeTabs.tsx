
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Employee } from '@/types/employee';
import { 
  InformationsTab, 
  DocumentsTab, 
  CompetencesTab, 
  EvaluationsTab, 
  FormationsTab,
  HorairesTab, 
  FeuillesDeTempsTab, 
  CongesTab 
} from './EmployeeTabContent';

interface EmployeeTabsProps {
  employee: Employee;
  activeTab: string;
  onTabChange: (value: string) => void;
  onRefresh?: () => void;
}

const EmployeeTabs: React.FC<EmployeeTabsProps> = ({ 
  employee, 
  activeTab, 
  onTabChange,
  onRefresh 
}) => {
  return (
    <div className="overflow-auto max-h-[calc(90vh-80px)]">
      <Tabs 
        defaultValue="informations" 
        value={activeTab}
        onValueChange={onTabChange}
        className="w-full"
      >
        <TabsList className="sticky top-0 z-10 bg-white">
          <TabsTrigger value="informations">Informations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="competences">Compétences</TabsTrigger>
          <TabsTrigger value="horaires">Horaires</TabsTrigger>
          <TabsTrigger value="feuillesDeTemps">Feuilles de temps</TabsTrigger>
          <TabsTrigger value="conges">Congés</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
          <TabsTrigger value="formations">Formations</TabsTrigger>
        </TabsList>
        
        <div className="p-6">
          <TabsContent value="informations">
            <InformationsTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="documents">
            <DocumentsTab employee={employee} onRefresh={onRefresh} />
          </TabsContent>
          
          <TabsContent value="competences">
            <CompetencesTab employee={employee} onRefresh={onRefresh} />
          </TabsContent>
          
          <TabsContent value="horaires">
            <HorairesTab employee={employee} onRefresh={onRefresh} />
          </TabsContent>
          
          <TabsContent value="feuillesDeTemps">
            <FeuillesDeTempsTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="conges">
            <CongesTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="evaluations">
            <EvaluationsTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="formations">
            <FormationsTab employee={employee} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default EmployeeTabs;
