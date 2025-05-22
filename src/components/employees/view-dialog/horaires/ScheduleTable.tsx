
import React from 'react';
import { Calendar, Clock, Plus, AlertCircle } from "lucide-react";
import { WorkSchedule, daysOfWeek } from './types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from '@/components/ui/card';

interface ScheduleTableProps {
  schedules: WorkSchedule[];
  onAddSchedule?: () => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedules, onAddSchedule }) => {
  // Vérifier si le tableau de schedules est vide ou non défini
  const hasSchedules = Array.isArray(schedules) && schedules.length > 0;
  
  if (!hasSchedules) {
    return (
      <Card className="p-8 text-center border bg-gray-50">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun horaire défini</h3>
        <p className="mt-1 text-sm text-gray-500">
          Cliquez sur le bouton ci-dessous pour ajouter des horaires de travail pour cet employé.
        </p>
        <Button 
          variant="outline" 
          className="mt-4 flex items-center justify-center" 
          onClick={onAddSchedule}
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un horaire
        </Button>
      </Card>
    );
  }

  // Utiliser une copie triée des horaires pour l'affichage
  const sortedSchedules = [...schedules].sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jour</TableHead>
            <TableHead>Horaires</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSchedules.map((schedule, index) => (
            <TableRow key={schedule.id || index}>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                  {daysOfWeek[schedule.dayOfWeek]}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-green-500" />
                  {schedule.startTime} - {schedule.endTime}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center p-4" 
        onClick={onAddSchedule}
      >
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un horaire
      </Button>
    </div>
  );
};

export default ScheduleTable;
