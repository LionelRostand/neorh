
import { useState, useEffect, useRef } from 'react';
import { Employee } from "@/types/employee";
import { WorkSchedule } from './types';
import { useFirestore } from '@/hooks/firestore';
import { toast } from '@/components/ui/use-toast';

export const useEmployeeSchedules = (employee: Employee, onRefresh?: () => void) => {
  const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
  const [editedSchedules, setEditedSchedules] = useState<WorkSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const fetchedRef = useRef(false);
  
  const schedulesCollection = useFirestore<WorkSchedule>("hr_work_schedules");
  
  // Fetch employee schedules
  useEffect(() => {
    // Éviter les requêtes multiples avec useRef
    if (fetchedRef.current || !employee.id) return;
    
    const fetchSchedules = async () => {
      setIsLoading(true);
      
      try {
        console.log(`[useEmployeeSchedules] Fetching schedules for employee ID: ${employee.id}`);
        fetchedRef.current = true;
        
        const result = await schedulesCollection.search({
          field: 'employeeId',
          value: employee.id
        });
        
        if (result.docs && result.docs.length > 0) {
          console.log(`[useEmployeeSchedules] Found ${result.docs.length} schedules`);
          const sortedSchedules = [...result.docs].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
          setSchedules(sortedSchedules);
          setEditedSchedules([...sortedSchedules]);
        } else {
          console.log("[useEmployeeSchedules] No schedules found for this employee");
          setSchedules([]);
          setEditedSchedules([]);
        }
      } catch (error) {
        console.error("[useEmployeeSchedules] Error fetching schedules:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les horaires",
          variant: "destructive"
        });
        // Reset states to prevent UI bugs
        setSchedules([]);
        setEditedSchedules([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSchedules();
  }, [employee.id, schedulesCollection]);
  
  // Handle adding a new schedule
  const handleAddSchedule = () => {
    console.log("[useEmployeeSchedules] Adding new schedule");
    const newSchedule: WorkSchedule = {
      employeeId: employee.id!,
      dayOfWeek: 1, // Default to Monday
      startTime: "09:00",
      endTime: "17:00",
      isActive: true
    };
    
    setEditedSchedules(currentSchedules => {
      const newSchedules = [...currentSchedules, newSchedule];
      console.log("[useEmployeeSchedules] New schedules array:", newSchedules);
      return newSchedules;
    });
  };
  
  // Handle removing a schedule
  const handleRemoveSchedule = (index: number) => {
    console.log("[useEmployeeSchedules] Removing schedule at index:", index);
    setEditedSchedules(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle changing a schedule
  const handleScheduleChange = (index: number, field: keyof WorkSchedule, value: any) => {
    console.log(`[useEmployeeSchedules] Changing schedule at index ${index}, field: ${field}, value: ${value}`);
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
      console.log("[useEmployeeSchedules] Saving schedules:", editedSchedules);
      
      // Delete existing schedules
      const deletePromises = schedules
        .filter(schedule => schedule.id) // S'assurer que l'ID existe
        .map(schedule => schedulesCollection.remove(schedule.id!));
      
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
        console.log("[useEmployeeSchedules] Existing schedules deleted");
      }
      
      // Create new schedules
      const createPromises = editedSchedules.map(schedule => 
        schedulesCollection.add({
          ...schedule,
          employeeId: employee.id!
        })
      );
      
      await Promise.all(createPromises);
      console.log("[useEmployeeSchedules] New schedules created");
      
      // Directly update the schedules array
      const newSortedSchedules = [...editedSchedules]
        .sort((a, b) => a.dayOfWeek - b.dayOfWeek);
      
      setSchedules(newSortedSchedules);
      fetchedRef.current = false; // Permettre une nouvelle requête après sauvegarde
      console.log("[useEmployeeSchedules] Local state updated with new schedules");
      
      toast({
        title: "Succès",
        description: "Horaires enregistrés avec succès"
      });
      
      // Exit edit mode
      setIsEditing(false);
      
      // Call refresh callback if provided
      if (onRefresh) onRefresh();
      
    } catch (error) {
      console.error("[useEmployeeSchedules] Error saving schedules:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les horaires",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset le fetch lorsque l'employé change
  useEffect(() => {
    fetchedRef.current = false;
  }, [employee.id]);
  
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
