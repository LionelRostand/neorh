
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useFirestore } from "@/hooks/useFirestore";
import { Timesheet } from "@/lib/constants";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";

// Définir le schéma de validation
const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  employeeId: z.string().min(1, "Veuillez sélectionner un employé"),
  month: z.string().min(1, "Veuillez sélectionner un mois"),
  comment: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface NewTimesheetFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const months = [
  { value: "01", label: "Janvier" },
  { value: "02", label: "Février" },
  { value: "03", label: "Mars" },
  { value: "04", label: "Avril" },
  { value: "05", label: "Mai" },
  { value: "06", label: "Juin" },
  { value: "07", label: "Juillet" },
  { value: "08", label: "Août" },
  { value: "09", label: "Septembre" },
  { value: "10", label: "Octobre" },
  { value: "11", label: "Novembre" },
  { value: "12", label: "Décembre" },
];

const NewTimesheetForm: React.FC<NewTimesheetFormProps> = ({ open, onClose, onSuccess }) => {
  const { employees, isLoading: isLoadingEmployees } = useEmployeeData();
  const timesheetCollection = useFirestore<Timesheet>("hr_timesheet");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      employeeId: "",
      month: "",
      comment: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: FormValues) => {
    try {
      // Calculer les dates de début et de fin basées sur le mois sélectionné
      const year = new Date().getFullYear();
      const monthIndex = parseInt(data.month) - 1;
      const firstDay = new Date(year, monthIndex, 1);
      const lastDay = new Date(year, monthIndex + 1, 0);
      
      // Formater les dates
      const weekStartDate = firstDay.toISOString().split('T')[0];
      const weekEndDate = lastDay.toISOString().split('T')[0];
      
      // S'assurer que tous les champs requis sont fournis pour satisfaire le type Timesheet
      const newTimesheet: Omit<Timesheet, "id"> = {
        employeeId: data.employeeId,
        taskDescription: data.comment || "",
        weekStartDate,
        weekEndDate,
        hours: 0,
        status: "draft",
        submittedAt: new Date().toISOString(),
        // Ajoutons d'autres champs requis avec des valeurs par défaut
        hoursWorked: 0,
        date: weekStartDate
      };
      
      await timesheetCollection.add(newTimesheet);
      
      showSuccessToast("Nouvelle feuille de temps créée avec succès");
      form.reset();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création de la feuille de temps:", error);
      showErrorToast("Erreur lors de la création de la feuille de temps");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle feuille de temps</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de la feuille de temps</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Feuille de temps - Mars 2025" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employé</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isLoadingEmployees}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un employé" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id || ""}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mois</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un mois" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaires (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ajouter des informations complémentaires..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                {isSubmitting ? "Traitement en cours..." : "Créer la feuille de temps"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTimesheetForm;
