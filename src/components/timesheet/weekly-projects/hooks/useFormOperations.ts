
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { Timesheet } from "@/lib/constants";
import { WeeklyData } from "../../types";
import { useTimesheetService } from '../services/timesheetService';

export const useFormOperations = (
  timesheet: Timesheet | null,
  weeklyData: WeeklyData[],
  onSuccess?: () => void
) => {
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { saveWeeklyData, submitWeek } = useTimesheetService();

  const handleSave = async () => {
    if (!timesheet || !timesheet.id) return;
    
    try {
      setSaving(true);
      await saveWeeklyData(timesheet, weeklyData);
      
      toast({
        title: "Succès",
        description: "Les données ont été enregistrées avec succès",
        variant: "default"
      });
    } catch (error) {
      console.error("Error saving timesheet:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les données",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitWeek = async (weekIndex: number) => {
    if (!timesheet || !timesheet.id) return;
    
    const week = weeklyData[weekIndex];
    const totalDays = week.projects.reduce((sum, project) => sum + project.days, 0);
    
    if (totalDays === 0) {
      toast({
        title: "Attention",
        description: "Ajoutez au moins un projet avec des jours pour soumettre",
        variant: "destructive"
      });
      return;
    }
    
    if (totalDays > 5) {
      toast({
        title: "Attention",
        description: "Le total des jours ne peut pas dépasser 5 jours par semaine",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSubmitting(true);
      await submitWeek(timesheet, weeklyData);
      
      toast({
        title: "Succès",
        description: `Semaine ${week.week} soumise avec succès`,
        variant: "default"
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting week:", error);
      toast({
        title: "Erreur",
        description: "Impossible de soumettre la semaine",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    saving,
    submitting,
    handleSave,
    handleSubmitWeek
  };
};
