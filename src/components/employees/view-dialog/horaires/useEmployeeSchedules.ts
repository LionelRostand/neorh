
import { useState, useEffect } from 'react';
import { Employee } from "@/types/employee";
import { WorkSchedule } from './types';
import { useFirestore } from '@/hooks/firestore';
import { toast } from '@/components/ui/use-toast';

export const useEmployeeSchedules = (employee: Employee, onRefresh?: () => void) => {
  const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
  const [editedSchedules, setEditedSchedules] = useState<WorkSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const schedulesCollection = useFirestore<WorkSchedule>("hr_work_schedules");
  
  // Fetch employee schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!employee.id) return;
      
      setIsLoading(true);
      
      try {
        const result = await schedulesCollection.search({
          field: 'employeeId',
          value: employee.id
        });
        
        if (result.docs && result.docs.length > 0) {
          const sortedSchedules = [...result.docs].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
          setSchedules(sortedSchedules);
          setEditedSchedules(sortedSchedules);
        } else {
          // If no schedules found, set to empty arrays
          setSchedules([]);
          setEditedSchedules([]);
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les horaires",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSchedules();
  }, [employee.id, schedulesCollection]);
  
  // Handle adding a new schedule
  const handleAddSchedule = () => {
    console.log("Adding new schedule");
    const newSchedule: WorkSchedule = {
      employeeId: employee.id!,
      dayOfWeek: 1, // Default to Monday
      startTime: "09:00",
      endTime: "17:00",
      isActive: true
    };
    
    setEditedSchedules(prev => [...prev, newSchedule]);
  };
  
  // Handle removing a schedule
  const handleRemoveSchedule = (index: number) => {
    console.log("Removing schedule at index:", index);
    setEditedSchedules(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle changing a schedule
  const handleScheduleChange = (index: number, field: keyof WorkSchedule, value: any) => {
    console.log(`Changing schedule at index ${index}, field: ${field}, value: ${value}`);
    setEditedSchedules(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };
  
  // Save the schedules
  const handleSaveSchedules = async () => {
    if (!employee.id) return;
    
    setIsLoading(true);
    
    try {
      console.log("Saving schedules:", editedSchedules);
      
      // Delete existing schedules
      const deletePromises = schedules.map(schedule => 
        schedule.id ? schedulesCollection.remove(schedule.id) : Promise.resolve()
      );
      
      await Promise.all(deletePromises);
      
      // Create new schedules
      const createPromises = editedSchedules.map(schedule => 
        schedulesCollection.add({
          ...schedule,
          employeeId: employee.id!
        })
      );
      
      await Promise.all(createPromises);
      
      // Update local state with the newly saved schedules
      const result = await schedulesCollection.search({
        field: 'employeeId',
        value: employee.id
      });
      
      if (result.docs) {
        const sortedSchedules = [...result.docs].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
        setSchedules(sortedSchedules);
        setEditedSchedules(sortedSchedules);
      }
      
      toast({
        title: "Succès",
        description: "Horaires enregistrés avec succès"
      });
      
      // Exit edit mode
      setIsEditing(false);
      
      // Call refresh callback if provided
      if (onRefresh) onRefresh();
      
    } catch (error) {
      console.error("Error saving schedules:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les horaires",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    schedules,
    editedSchedules,
    isLoading,
    isEditing,
    setIsEditing,
    setEditedSchedules,
    handleAddSchedule,
    handleRemoveSchedule,
    handleScheduleChange,
    handleSaveSchedules
  };
};
