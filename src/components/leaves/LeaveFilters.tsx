
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";

interface LeaveFiltersProps {
  onSearch: (query: string) => void;
}

const LeaveFilters = ({ onSearch }: LeaveFiltersProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="p-4 flex justify-between items-center border-b">
      <div className="relative w-full max-w-sm">
        <Input 
          placeholder="Rechercher..." 
          className="pl-8"
          onChange={handleSearchChange}
        />
        <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <div>
        <Button variant="outline" className="gap-2">
          Tous les statuts <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default LeaveFilters;
