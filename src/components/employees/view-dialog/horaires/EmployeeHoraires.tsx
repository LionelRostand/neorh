
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Save, Plus } from "lucide-react";
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
  
  // Fonction pour activer directement le mode édition et ajouter un horaire
  const handleAddScheduleFromTable = () => {
    // D'abord activer le mode édition
    setIsEditing(true);
    
    // Utiliser un délai pour s'assurer que le state a eu le temps de se mettre à jour
    setTimeout(() => {
      // Puis ajouter un horaire
      handleAddSchedule();
    }, 100);
  };

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
      
      {isEditing ? (
        <>
          <ScheduleForm
            schedules={editedSchedules}
            handleScheduleChange={handleScheduleChange}
            handleRemoveSchedule={handleRemoveSchedule}
          />
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center p-4" 
            onClick={handleAddSchedule}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un horaire
          </Button>
        </>
      ) : (
        <ScheduleTable 
          schedules={schedules} 
          isLoading={isLoading} 
          onAddSchedule={handleAddScheduleFromTable}
        />
      )}
    </div>
  );
};

export default EmployeeHoraires;
