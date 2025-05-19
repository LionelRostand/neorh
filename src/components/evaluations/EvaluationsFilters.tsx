
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, FilterIcon } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface EvaluationsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedEmployee: string;
  onEmployeeChange: (value: string) => void;
  employees: { id: string; name: string }[] | null;
}

const EvaluationsFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedStatus, 
  onStatusChange,
  selectedEmployee,
  onEmployeeChange,
  employees
}: EvaluationsFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Rechercher une évaluation..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex gap-2">
        <Select 
          value={selectedEmployee} 
          onValueChange={onEmployeeChange}
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Tous les employés" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les employés</SelectItem>
            {employees?.map(employee => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={selectedStatus} 
          onValueChange={onStatusChange}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="planifiée">Planifiée</SelectItem>
            <SelectItem value="complétée">Complétée</SelectItem>
            <SelectItem value="annulée">Annulée</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="icon">
          <FilterIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EvaluationsFilters;
