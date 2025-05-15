
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Employee } from '@/types/employee';
import { 
  InformationsTab, 
  DocumentsTab,
  CompetencesTab,
  HorairesTab,
  CongesTab,
  EvaluationsTab
} from './EmployeeTabContent';

interface EmployeeTabsProps {
  employee: Employee;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const EmployeeTabs: React.FC<EmployeeTabsProps> = ({ employee, activeTab, onTabChange }) => {
  return (
    <Tabs defaultValue="informations" value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-6 bg-gray-50 border-b">
        <TabsTrigger value="informations">Informations</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="competences">Compétences</TabsTrigger>
        <TabsTrigger value="horaires">Horaires</TabsTrigger>
        <TabsTrigger value="conges">Congés</TabsTrigger>
        <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
      </TabsList>
      
      <ScrollArea className="h-[calc(90vh-140px)]">
        <TabsContent value="informations" className="p-6 focus:outline-none">
          <InformationsTab employee={employee} />
        </TabsContent>
        
        <TabsContent value="documents" className="p-6">
          <DocumentsTab />
        </TabsContent>
        
        <TabsContent value="competences" className="p-6">
          <CompetencesTab />
        </TabsContent>
        
        <TabsContent value="horaires" className="p-6">
          <HorairesTab />
        </TabsContent>
        
        <TabsContent value="conges" className="p-6">
          <CongesTab />
        </TabsContent>
        
        <TabsContent value="evaluations" className="p-6">
          <EvaluationsTab />
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
};

export default EmployeeTabs;
