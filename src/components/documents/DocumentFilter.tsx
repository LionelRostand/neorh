
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
        <TabsList className="border-b w-full rounded-none bg-transparent p-0 mb-6 flex gap-1">
          <TabsTrigger 
            value="all" 
            className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-2 rounded-none text-sm font-medium transition-colors"
          >
            Tous les documents
          </TabsTrigger>
          <TabsTrigger 
            value="contracts" 
            className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-2 rounded-none text-sm font-medium transition-colors"
          >
            Contrats
          </TabsTrigger>
          <TabsTrigger 
            value="paystubs" 
            className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-2 rounded-none text-sm font-medium transition-colors"
          >
            Fiches de paie
          </TabsTrigger>
          <TabsTrigger 
            value="certificates" 
            className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-2 rounded-none text-sm font-medium transition-colors"
          >
            Certifications
          </TabsTrigger>
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
