
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
import { useEmployeeSchedules } from './useEmployeeSchedules';
import ScheduleForm from './ScheduleForm';
import ScheduleTable from './ScheduleTable';
import { EmployeeHorairesProps } from './types';

const EmployeeHoraires: React.FC<EmployeeHorairesProps> = ({ employee, onRefresh }) => {
  const {
    schedules,
    isLoading,
    isEditing,
    setIsEditing,
    editedSchedules,
    setEditedSchedules,
    handleAddSchedule,
    handleRemoveSchedule,
    handleScheduleChange,
    handleSaveSchedules
  } = useEmployeeSchedules(employee, onRefresh);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Horaires de travail</h3>
        <div className="space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => {
                setEditedSchedules([...schedules]);
                setIsEditing(false);
              }}>
                Annuler
              </Button>
              <Button onClick={handleSaveSchedules}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-4">
          <p>Chargement des horaires...</p>
        </div>
      ) : (
        <>
          {isEditing ? (
            <ScheduleForm
              schedules={editedSchedules}
              handleScheduleChange={handleScheduleChange}
              handleRemoveSchedule={handleRemoveSchedule}
              handleAddSchedule={handleAddSchedule}
            />
          ) : (
            <ScheduleTable schedules={schedules} />
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeHoraires;
