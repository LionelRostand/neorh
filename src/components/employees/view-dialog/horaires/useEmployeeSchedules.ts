
import { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/firestore';
import { toast } from "@/components/ui/use-toast";
import { Employee } from "@/types/employee";
import { WorkSchedule } from './types';

export const useEmployeeSchedules = (employee: Employee, onRefresh?: () => void) => {
  const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSchedules, setEditedSchedules] = useState<WorkSchedule[]>([]);
  
  const schedulesCollection = useFirestore<WorkSchedule>('hr_work_schedules');
  
  // Load employee schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoading(true);
      try {
        // Using search instead of getWhere
        const response = await schedulesCollection.search({ 
          field: 'employeeId', 
          value: employee.id || '',
          operator: '=='
        });
        
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
  
  // Add a new schedule
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
  
  // Remove a schedule
  const handleRemoveSchedule = (index: number) => {
    const newSchedules = [...editedSchedules];
    newSchedules.splice(index, 1);
    setEditedSchedules(newSchedules);
  };
  
  // Update a schedule
  const handleScheduleChange = (index: number, field: keyof WorkSchedule, value: any) => {
    const newSchedules = [...editedSchedules];
    newSchedules[index] = {
      ...newSchedules[index],
      [field]: value
    };
    setEditedSchedules(newSchedules);
  };
  
  // Save schedules
  const handleSaveSchedules = async () => {
    try {
      // Remove old schedules
      for (const schedule of schedules) {
        if (schedule.id) {
          await schedulesCollection.remove(schedule.id);
        }
      }
      
      // Add new schedules
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

  return {
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
  };
};
