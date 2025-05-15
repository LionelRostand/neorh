
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Network, FileText, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EmployeesHierarchy from "@/components/hierarchy/EmployeesHierarchy";
import HierarchyStatCard from "@/components/hierarchy/HierarchyStatCard";

const Hierarchie = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const handleExportImport = () => {
    toast({
      title: "Fonctionnalité d'export/import",
      description: "Cette fonctionnalité sera disponible prochainement.",
    });
  };

  const handleNewHierarchy = () => {
    toast({
      title: "Nouveau département",
      description: "La création d'un nouveau département sera disponible prochainement.",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hiérarchie</h1>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <HierarchyStatCard 
          title="Total des départements" 
          value={8} 
          icon={<Network className="h-8 w-8" />} 
          bgColor="bg-blue-50"
          textColor="text-blue-700"
          borderColor="border-blue-500"
          iconColor="text-blue-500"
        />
        <HierarchyStatCard 
          title="Managers" 
          value={12} 
          icon={<Network className="h-8 w-8" />} 
          bgColor="bg-indigo-50"
          textColor="text-indigo-700"
          borderColor="border-indigo-500"
          iconColor="text-indigo-500"
        />
        <HierarchyStatCard 
          title="Employés" 
          value={68} 
          icon={<Network className="h-8 w-8" />} 
          bgColor="bg-green-50"
          textColor="text-green-700"
          borderColor="border-green-500"
          iconColor="text-green-500"
        />
        <HierarchyStatCard 
          title="Postes vacants" 
          value={4} 
          icon={<Network className="h-8 w-8" />} 
          bgColor="bg-yellow-50"
          textColor="text-yellow-700"
          borderColor="border-yellow-500"
          iconColor="text-yellow-500"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-medium">Structure Hiérarchique</h2>
          <Select 
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous les départements" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les départements</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="it">IT</SelectItem>
              <SelectItem value="hr">Ressources Humaines</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportImport}>
            <FileText className="h-4 w-4 mr-2" />
            Exporter / Importer
          </Button>
          <Button onClick={handleNewHierarchy}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Unité
          </Button>
        </div>
      </div>

      {/* Hierarchy Chart */}
      <div className="border rounded-lg bg-white p-6">
        <EmployeesHierarchy />
      </div>
    </div>
  );
};

export default Hierarchie;
