
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DocumentFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DocumentFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  activeTab, 
  setActiveTab 
}: DocumentFilterProps) => {
  return (
    <>
      <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
          <TabsTrigger value="all" className="text-sm">Tous les documents</TabsTrigger>
          <TabsTrigger value="contracts" className="text-sm">Contrats</TabsTrigger>
          <TabsTrigger value="paystubs" className="text-sm">Fiches de paie</TabsTrigger>
          <TabsTrigger value="certificates" className="text-sm">Certifications</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher un document..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
    </>
  );
};

export default DocumentFilter;
