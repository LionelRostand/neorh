
import React from 'react';
import { Calendar, Clock } from "lucide-react";
import { WorkSchedule, daysOfWeek } from './types';

interface ScheduleTableProps {
  schedules: WorkSchedule[];
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedules }) => {
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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Jour</th>
            <th className="p-3 text-left">Horaires</th>
          </tr>
        </thead>
        <tbody>
          {schedules
            .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
            .map((schedule, index) => (
            <tr key={index} className="border-b">
              <td className="p-3">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                  {daysOfWeek[schedule.dayOfWeek]}
                </div>
              </td>
              <td className="p-3">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-green-500" />
                  {schedule.startTime} - {schedule.endTime}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
