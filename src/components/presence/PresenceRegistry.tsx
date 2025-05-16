
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import { usePresenceData } from '@/hooks/usePresenceData';
import { Presence } from '@/types/presence';

export const PresenceRegistry = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  
  const { presenceRecords, isLoading, error, refreshData } = usePresenceData();
  
  // Filtrer les enregistrements en fonction des critères
  const filteredRecords = presenceRecords.filter(record => {
    // Filtrer par date si une date est sélectionnée
    if (selectedDate) {
      const recordDate = record.date.split('/').reverse().join('-');
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
    if (selectedDepartment && record.department !== selectedDepartment) {
      return false;
    }
    
    return true;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return "bg-green-100 text-green-800";
      case 'absent': return "bg-gray-100 text-gray-800";
      case 'late': return "bg-amber-100 text-amber-800";
      case 'early-leave': return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return "Présent";
      case 'absent': return "Absent";
      case 'late': return "Retard";
      case 'early-leave': return "Départ anticipé";
      default: return status;
    }
  };
  
  // Fonction pour rafraîchir les données
  const handleRefresh = () => {
    refreshData();
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
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
                  <SelectItem value="">Tous les départements</SelectItem>
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
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4" />
                Actualiser
              </Button>
            </div>
          </div>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Badge</TableHead>
                <TableHead>Heure d'entrée</TableHead>
                <TableHead>Heure de sortie</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Chargement des données...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-red-500">
                    Erreur lors du chargement des données
                  </TableCell>
                </TableRow>
              ) : filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Aucun enregistrement de présence pour cette journée
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map(record => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.employeeName}</TableCell>
                    <TableCell>{record.employeeId}</TableCell>
                    <TableCell>{record.badgeId || "-"}</TableCell>
                    <TableCell>{record.timeIn || "-"}</TableCell>
                    <TableCell>{record.timeOut || "-"}</TableCell>
                    <TableCell>{record.duration || "-"}</TableCell>
                    <TableCell>
                      <span className={`py-1 px-2 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {getStatusText(record.status)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
