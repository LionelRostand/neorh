
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Save, Plus } from "lucide-react";
import { useEmployeeSchedules } from './useEmployeeSchedules';
import ScheduleForm from './ScheduleForm';
import ScheduleTable from './ScheduleTable';
import { EmployeeHorairesProps } from './types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from "@/components/ui/card";

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
    setIsEditing(true);
  };

  // Afficher un état de chargement pendant la récupération des données
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  return (
    <Card className="border p-6 space-y-6">
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
          onAddSchedule={handleAddScheduleFromTable}
        />
      )}
    </Card>
  );
};

export default EmployeeHoraires;
