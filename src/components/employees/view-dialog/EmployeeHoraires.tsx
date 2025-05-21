
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Edit, Save, Plus, Trash } from "lucide-react";
import { Employee } from "@/types/employee";
import { useFirestore } from '@/hooks/firestore';
import { toast } from "@/components/ui/use-toast";

interface WorkSchedule {
  id?: string;
  employeeId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface EmployeeHorairesProps {
  employee: Employee;
  onRefresh?: () => void;
}

const daysOfWeek = [
  "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"
];

export const EmployeeHoraires: React.FC<EmployeeHorairesProps> = ({ employee, onRefresh }) => {
  const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSchedules, setEditedSchedules] = useState<WorkSchedule[]>([]);
  
  const schedulesCollection = useFirestore<WorkSchedule>('hr_work_schedules');
  
  // Charger les horaires de l'employé
  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoading(true);
      try {
        const response = await schedulesCollection.getWhere('employeeId', '==', employee.id || '');
        if (response && response.docs) {
          setSchedules(response.docs);
          setEditedSchedules([...response.docs]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des horaires:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les horaires",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (employee.id) {
      fetchSchedules();
    }
  }, [employee.id]);
  
  // Ajouter un nouvel horaire
  const handleAddSchedule = () => {
    const newSchedule: WorkSchedule = {
      employeeId: employee.id || '',
      dayOfWeek: 1, // Monday by default
      startTime: "09:00",
      endTime: "17:00",
      isActive: true
    };
    
    setEditedSchedules([...editedSchedules, newSchedule]);
  };
  
  // Supprimer un horaire
  const handleRemoveSchedule = (index: number) => {
    const newSchedules = [...editedSchedules];
    newSchedules.splice(index, 1);
    setEditedSchedules(newSchedules);
  };
  
  // Mettre à jour un horaire
  const handleScheduleChange = (index: number, field: keyof WorkSchedule, value: any) => {
    const newSchedules = [...editedSchedules];
    newSchedules[index] = {
      ...newSchedules[index],
      [field]: value
    };
    setEditedSchedules(newSchedules);
  };
  
  // Sauvegarder les horaires
  const handleSaveSchedules = async () => {
    try {
      // Supprimer les anciens horaires
      for (const schedule of schedules) {
        if (schedule.id) {
          await schedulesCollection.remove(schedule.id);
        }
      }
      
      // Ajouter les nouveaux horaires
      for (const schedule of editedSchedules) {
        await schedulesCollection.add({
          employeeId: employee.id || '',
          dayOfWeek: schedule.dayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          isActive: true
        });
      }
      
      setSchedules([...editedSchedules]);
      setIsEditing(false);
      
      if (onRefresh) {
        onRefresh();
      }
      
      toast({
        title: "Succès",
        description: "Les horaires ont été sauvegardés avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des horaires:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les horaires",
        variant: "destructive",
      });
    }
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
      
      {isLoading ? (
        <div className="flex justify-center p-4">
          <p>Chargement des horaires...</p>
        </div>
      ) : (
        <>
          {isEditing ? (
            <div className="space-y-4">
              {editedSchedules.map((schedule, index) => (
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
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un horaire
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.length > 0 ? (
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
              ) : (
                <div className="p-8 text-center border rounded-lg bg-gray-50">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun horaire défini</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Cliquez sur modifier pour ajouter des horaires de travail pour cet employé.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeHoraires;
