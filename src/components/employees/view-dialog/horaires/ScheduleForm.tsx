
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { WorkSchedule, daysOfWeek } from './types';

interface ScheduleFormProps {
  schedules: WorkSchedule[];
  handleScheduleChange: (index: number, field: keyof WorkSchedule, value: any) => void;
  handleRemoveSchedule: (index: number) => void;
  handleAddSchedule: () => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  schedules,
  handleScheduleChange,
  handleRemoveSchedule,
  handleAddSchedule
}) => {
  return (
    <div className="space-y-4">
      {schedules.map((schedule, index) => (
        <Card key={index} className="border border-gray-200">
          <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Jour</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={schedule.dayOfWeek}
                  onChange={(e) => handleScheduleChange(index, 'dayOfWeek', parseInt(e.target.value))}
                >
                  {daysOfWeek.map((day, idx) => (
                    <option key={idx} value={idx}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Heure début</label>
                  <input
                    type="time"
                    className="w-full p-2 border rounded-md"
                    value={schedule.startTime}
                    onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Heure fin</label>
                  <input
                    type="time"
                    className="w-full p-2 border rounded-md"
                    value={schedule.endTime}
                    onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              size="icon"
              onClick={() => handleRemoveSchedule(index)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
      
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center p-4" 
        onClick={handleAddSchedule}
      >
        <span className="mr-2">+</span>
        Ajouter un horaire
      </Button>
    </div>
  );
};

export default ScheduleForm;
