
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { usePresenceData } from '@/hooks/presence';
import { PresenceFilters } from './filters/PresenceFilters';
import { PresenceTable } from './table/PresenceTable';

export const PresenceRegistry = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  
  // Utilisation du hook pour charger les données (optimisé pour éviter les boucles)
  const { presenceRecords, isLoading, error, refreshData } = usePresenceData();
  
  // Filtrer les enregistrements en fonction des critères
  const filteredRecords = presenceRecords.filter(record => {
    // Filtrer par date si une date est sélectionnée
    if (selectedDate) {
      const formattedSelectedDate = format(selectedDate, "dd/MM/yyyy");
      if (record.date !== formattedSelectedDate) {
        return false;
      }
    }
    
    // Filtrer par terme de recherche
    if (searchTerm && 
        !record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(record.badgeId && record.badgeId.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Filtrer par département si sélectionné
    if (selectedDepartment !== "all" && record.department !== selectedDepartment) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <PresenceFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            onRefresh={refreshData}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Registre du {selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: fr }) : "aujourd'hui"}
          </CardTitle>
          {isLoading && <div className="text-sm text-muted-foreground">Chargement...</div>}
        </CardHeader>
        <CardContent className="p-0">
          <PresenceTable 
            records={filteredRecords}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
};
