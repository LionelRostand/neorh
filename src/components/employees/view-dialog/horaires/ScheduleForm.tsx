
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { WorkSchedule, daysOfWeek } from './types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface ScheduleFormProps {
  schedules: WorkSchedule[];
  handleScheduleChange: (index: number, field: keyof WorkSchedule, value: any) => void;
  handleRemoveSchedule: (index: number) => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  schedules,
  handleScheduleChange,
  handleRemoveSchedule,
}) => {
  if (schedules.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg bg-gray-50">
        <p className="text-sm text-gray-500">
          Aucun horaire défini. Cliquez sur "Ajouter un horaire" pour commencer.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jour</TableHead>
            <TableHead>Heure de début</TableHead>
            <TableHead>Heure de fin</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule, index) => (
            <TableRow key={index}>
              <TableCell>
                <select
                  className="w-full p-2 border rounded-md"
                  value={schedule.dayOfWeek}
                  onChange={(e) => handleScheduleChange(index, 'dayOfWeek', parseInt(e.target.value))}
                >
                  {daysOfWeek.map((day, idx) => (
                    <option key={idx} value={idx}>{day}</option>
                  ))}
                </select>
              </TableCell>
              <TableCell>
                <input
                  type="time"
                  className="w-full p-2 border rounded-md"
                  value={schedule.startTime}
                  onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <input
                  type="time"
                  className="w-full p-2 border rounded-md"
                  value={schedule.endTime}
                  onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => handleRemoveSchedule(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScheduleForm;
