
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { TimesheetFormValues } from './types';

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

interface DayEntryFormProps {
  day: Date;
  dateKey: string;
  form: UseFormReturn<TimesheetFormValues>;
  canEdit: boolean;
}

// Formatter le nom du jour en français
const formatDayName = (date: Date): string => {
  return format(date, 'EEEE dd MMMM', { locale: fr });
};

const DayEntryForm: React.FC<DayEntryFormProps> = ({ day, dateKey, form, canEdit }) => {
  return (
    <div className="p-4 border rounded-md bg-gray-50">
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
};

export default DayEntryForm;
