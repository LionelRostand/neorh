
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format, parseISO, eachDayOfInterval, isWeekend } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Timesheet } from '@/lib/constants';
import { useFirestore } from '@/hooks/useFirestore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimesheetFormValues {
  dailyHours: Record<string, {
    hours: number;
    projectId: string;
    notes: string;
  }>;
  notes: string;
}

interface TimesheetDetailFormProps {
  timesheet: Timesheet;
  onClose: () => void;
}

// Liste des projets (à remplacer par une vraie liste depuis la base de données)
const PROJECTS = [
  { id: 'PROJ-001', name: 'Développement Frontend' },
  { id: 'PROJ-002', name: 'Maintenance API' },
  { id: 'PROJ-003', name: 'Refactorisation Database' },
];

// Valeurs possibles pour les heures travaillées
const TIME_VALUES = [
  { value: 0, label: '0 - Absent' },
  { value: 0.25, label: '0.25 - 2h' },
  { value: 0.5, label: '0.5 - 4h' },
  { value: 0.75, label: '0.75 - 6h' },
  { value: 1, label: '1 - Journée complète (8h)' },
];

const TimesheetDetailForm: React.FC<TimesheetDetailFormProps> = ({ timesheet, onClose }) => {
  const timesheetCollection = useFirestore<Timesheet>('hr_timesheet');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workDays, setWorkDays] = useState<Date[]>([]);

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
            projectId: timesheet.projectId || PROJECTS[0].id,
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

  // Formatter le nom du jour en français
  const formatDayName = (date: Date): string => {
    return format(date, 'EEEE dd MMMM', { locale: fr });
  };

  // Vérifier si le formulaire peut être soumis (en fonction du statut)
  const canEdit = ['draft', 'submitted'].includes(timesheet.status);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {workDays.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            return (
              <div key={dateKey} className="p-4 border rounded-md bg-gray-50">
                <h3 className="font-medium mb-3 capitalize">{formatDayName(day)}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`dailyHours.${dateKey}.projectId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Projet</FormLabel>
                        <Select
                          disabled={!canEdit}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un projet" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PROJECTS.map((project) => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`dailyHours.${dateKey}.hours`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temps de travail</FormLabel>
                        <Select
                          disabled={!canEdit}
                          onValueChange={(value) => field.onChange(parseFloat(value))}
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner la durée" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TIME_VALUES.map((time) => (
                              <SelectItem key={time.value} value={time.value.toString()}>
                                {time.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`dailyHours.${dateKey}.notes`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Input
                            disabled={!canEdit}
                            placeholder="Notes pour cette journée"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes générales</FormLabel>
              <FormControl>
                <Textarea
                  disabled={!canEdit}
                  placeholder="Notes ou commentaires sur cette feuille de temps"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Informations supplémentaires concernant cette période de travail.
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Annuler
          </Button>
          
          {canEdit && (
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default TimesheetDetailForm;
