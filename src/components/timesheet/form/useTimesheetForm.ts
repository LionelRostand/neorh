
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format, parseISO, eachDayOfInterval, isWeekend } from 'date-fns';
import { Timesheet } from '@/lib/constants';
import { TimesheetFormValues } from './types';
import { useFirestore } from '@/hooks/useFirestore';
import { toast } from '@/components/ui/use-toast';

export const useTimesheetForm = (timesheet: Timesheet, onClose: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workDays, setWorkDays] = useState<Date[]>([]);
  const timesheetCollection = useFirestore<Timesheet>('hr_timesheet');

  // Initialiser le formulaire
  const form = useForm<TimesheetFormValues>({
    defaultValues: {
      dailyHours: {},
      notes: timesheet.taskDescription || '',
    },
  });

  // Générer les jours ouvrés de la période
  useEffect(() => {
    if (timesheet.weekStartDate && timesheet.weekEndDate) {
      try {
        const startDate = parseISO(timesheet.weekStartDate);
        const endDate = parseISO(timesheet.weekEndDate);
        
        // Obtenir tous les jours de l'intervalle
        const allDays = eachDayOfInterval({ start: startDate, end: endDate });
        
        // Filtrer pour ne garder que les jours ouvrés (exclure weekend)
        const workingDays = allDays.filter(day => !isWeekend(day));
        setWorkDays(workingDays);
        
        // Initialiser les valeurs par défaut pour chaque jour
        const initialDailyHours: Record<string, { hours: number, projectId: string, notes: string }> = {};
        workingDays.forEach(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          initialDailyHours[dateKey] = {
            hours: 0,
            projectId: timesheet.projectId || 'PROJ-001',
            notes: '',
          };
        });
        
        form.reset({
          dailyHours: initialDailyHours,
          notes: timesheet.taskDescription || '',
        });
      } catch (error) {
        console.error('Error parsing timesheet dates:', error);
      }
    }
  }, [timesheet, form]);

  const onSubmit = async (data: TimesheetFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Calculer le total des heures
      let totalHours = 0;
      Object.values(data.dailyHours).forEach(day => {
        totalHours += day.hours * 8; // Convertir en heures (1 = 8h)
      });
      
      // Préparer les données à envoyer
      const updatedTimesheet: Partial<Timesheet> = {
        hours: totalHours,
        taskDescription: data.notes,
        dailyEntries: Object.entries(data.dailyHours).map(([date, entry]) => ({
          date,
          hours: entry.hours,
          projectId: entry.projectId,
          notes: entry.notes
        })),
      };
      
      // Si la feuille était en brouillon, la passer en soumise
      if (timesheet.status === 'draft') {
        updatedTimesheet.status = 'submitted';
        updatedTimesheet.submittedAt = new Date().toISOString();
      }
      
      // Mise à jour dans Firestore
      if (timesheet.id) {
        await timesheetCollection.update(timesheet.id, updatedTimesheet);
        
        toast({
          title: "Feuille de temps enregistrée",
          description: `La feuille de temps a été mise à jour avec succès.`,
        });
        
        onClose();
      }
    } catch (error) {
      console.error('Error saving timesheet:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la feuille de temps.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Vérifier si le formulaire peut être soumis (en fonction du statut)
  const canEdit = ['draft', 'submitted'].includes(timesheet.status);

  return {
    form,
    workDays,
    isSubmitting,
    canEdit,
    onSubmit
  };
};
