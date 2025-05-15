
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CompanySearchProps {
  value: string;
  onChange: (value: string) => void;
}

const CompanySearch = ({ value, onChange }: CompanySearchProps) => {
  return (
    <div className="py-4">
      <div className="relative w-full max-w-sm">
        <Input 
          placeholder="Rechercher..." 
          className="pl-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default CompanySearch;
