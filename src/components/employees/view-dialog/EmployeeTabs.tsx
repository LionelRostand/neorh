
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Employee } from '@/types/employee';
import { 
  InformationsTab, 
  DocumentsTab,
  CompetencesTab,
  HorairesTab,
  CongesTab,
  FeuillesDeTempsTab,
  EvaluationsTab,
  FormationsTab
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
  // Utilisons React.memo pour éviter les re-renders inutiles des onglets
  const MemoizedDocumentsTab = React.memo(DocumentsTab);
  const MemoizedFeuillesDeTempsTab = React.memo(FeuillesDeTempsTab);
  const MemoizedCongesTab = React.memo(CongesTab);
  const MemoizedFormationsTab = React.memo(FormationsTab);

  return (
    <Tabs defaultValue="informations" value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-8 bg-gray-50 border-b">
        <TabsTrigger value="informations">Informations</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="competences">Compétences</TabsTrigger>
        <TabsTrigger value="horaires">Horaires</TabsTrigger>
        <TabsTrigger value="feuillesdetemps">Feuilles de temps</TabsTrigger>
        <TabsTrigger value="conges">Congés</TabsTrigger>
        <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
        <TabsTrigger value="formations">Formations</TabsTrigger>
      </TabsList>
      
      <ScrollArea className="h-[calc(90vh-140px)]">
        <TabsContent value="informations" className="p-6 focus:outline-none">
          <InformationsTab employee={employee} />
        </TabsContent>
        
        <TabsContent value="documents" className="p-6">
          <MemoizedDocumentsTab employee={employee} />
        </TabsContent>
        
        <TabsContent value="competences" className="p-6">
          <CompetencesTab employee={employee} />
        </TabsContent>
        
        <TabsContent value="horaires" className="p-6">
          <HorairesTab employee={employee} onRefresh={onRefresh} />
        </TabsContent>
        
        <TabsContent value="feuillesdetemps" className="p-6">
          <MemoizedFeuillesDeTempsTab employee={employee} />
        </TabsContent>
        
        <TabsContent value="conges" className="p-6">
          <MemoizedCongesTab employee={employee} />
        </TabsContent>
        
        <TabsContent value="evaluations" className="p-6">
          <EvaluationsTab employee={employee} />
        </TabsContent>
        
        <TabsContent value="formations" className="p-6">
          <MemoizedFormationsTab employee={employee} />
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
};

export default React.memo(EmployeeTabs);
