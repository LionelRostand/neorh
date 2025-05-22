
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
    <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
      <Tabs 
        defaultValue="informations" 
        value={activeTab}
        onValueChange={onTabChange}
        className="w-full"
      >
        <TabsList className="mb-6 bg-gray-100 p-1 overflow-x-auto flex w-full max-w-full no-scrollbar">
          <TabsTrigger value="informations" className="flex-1">Informations</TabsTrigger>
          <TabsTrigger value="documents" className="flex-1 whitespace-nowrap">Documents</TabsTrigger>
          <TabsTrigger value="competences" className="flex-1 whitespace-nowrap">Compétences</TabsTrigger>
          <TabsTrigger value="horaires" className="flex-1 whitespace-nowrap">Horaires</TabsTrigger>
          <TabsTrigger value="feuillesDeTemps" className="flex-1 whitespace-nowrap">Feuilles de temps</TabsTrigger>
          <TabsTrigger value="conges" className="flex-1 whitespace-nowrap">Congés</TabsTrigger>
          <TabsTrigger value="evaluations" className="flex-1 whitespace-nowrap">Évaluations</TabsTrigger>
          <TabsTrigger value="formations" className="flex-1 whitespace-nowrap">Formations</TabsTrigger>
        </TabsList>
        
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
      </Tabs>
    </div>
  );
};

export default EmployeeTabs;
