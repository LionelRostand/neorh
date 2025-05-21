
import React from 'react';
import { Calendar, Clock } from "lucide-react";
import { WorkSchedule, daysOfWeek } from './types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface ScheduleTableProps {
  schedules: WorkSchedule[];
  isLoading?: boolean;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedules, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center border rounded-lg bg-gray-50">
        <Clock className="mx-auto h-12 w-12 text-blue-400 animate-pulse" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Chargement des horaires...</h3>
      </div>
    );
  }
  
  if (schedules.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg bg-gray-50">
        <Clock className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun horaire défini</h3>
        <p className="mt-1 text-sm text-gray-500">
          Cliquez sur modifier pour ajouter des horaires de travail pour cet employé.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Jour</TableHead>
          <TableHead>Horaires</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedules
          .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
          .map((schedule, index) => (
          <TableRow key={index}>
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
  );
};

export default ScheduleTable;
