
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Search, Calendar as CalendarIcon, RefreshCw } from "lucide-react";

interface PresenceFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  onRefresh: () => void;
}

export const PresenceFilters: React.FC<PresenceFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedDate,
  setSelectedDate,
  selectedDepartment,
  setSelectedDepartment,
  onRefresh
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Recherche</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un employé..."
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: fr }) : "Sélectionner une date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              className="pointer-events-auto p-3"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Département</label>
        <Select onValueChange={setSelectedDepartment} value={selectedDepartment}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les départements" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les départements</SelectItem>
            <SelectItem value="it">IT</SelectItem>
            <SelectItem value="rh">Ressources Humaines</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-end">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2" 
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </Button>
      </div>
    </div>
  );
};
