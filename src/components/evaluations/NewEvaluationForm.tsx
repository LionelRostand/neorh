
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useFirestore } from "@/hooks/useFirestore";
import { Evaluation } from "@/hooks/useEmployeeEvaluations";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { toast } from "@/components/ui/use-toast";

const evaluationFormSchema = z.object({
  employeeId: z.string({
    required_error: "Veuillez sélectionner un employé",
  }),
  evaluator: z.string({
    required_error: "Veuillez entrer un évaluateur",
  }),
  title: z.string({
    required_error: "Veuillez entrer un titre",
  }).min(3, {
    message: "Le titre doit contenir au moins 3 caractères",
  }),
  date: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
  status: z.string({
    required_error: "Veuillez sélectionner un statut",
  }),
  comments: z.string().optional(),
});

type EvaluationFormValues = z.infer<typeof evaluationFormSchema>;

interface NewEvaluationFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export const NewEvaluationForm = ({ onCancel, onSuccess }: NewEvaluationFormProps) => {
  const { employees } = useEmployeeData();
  const { add } = useFirestore<Evaluation>("hr_evaluations");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationFormSchema),
    defaultValues: {
      evaluator: "Non assigné",
      status: "planifiée",
      comments: "",
    },
  });

  const onSubmit = async (values: EvaluationFormValues) => {
    setIsSubmitting(true);
    try {
      const evaluation: Omit<Evaluation, "id"> = {
        employeeId: values.employeeId,
        evaluator: values.evaluator,
        title: values.title,
        date: format(values.date, "yyyy-MM-dd"),
        status: values.status as "planifiée" | "complétée" | "annulée",
        comments: values.comments,
      };

      await add(evaluation);
      toast({
        title: "Évaluation créée",
        description: "L'évaluation a été créée avec succès",
      });
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la création de l'évaluation:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'évaluation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employé à évaluer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {employees?.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
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
          name="evaluator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Évaluateur</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un évaluateur" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Non assigné">Non assigné</SelectItem>
                  {employees?.map((employee) => (
                    <SelectItem key={employee.id} value={employee.name}>
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de l'évaluation</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Évaluation annuelle" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "d MMMM yyyy", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="planifiée">Planifiée</SelectItem>
                    <SelectItem value="complétée">Complétée</SelectItem>
                    <SelectItem value="annulée">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commentaires</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Objectifs et informations complémentaires" 
                  className="resize-none min-h-[120px]"
                  {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-3">
          <Button variant="outline" type="button" onClick={onCancel}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            {isSubmitting ? "Création..." : "Créer l'évaluation"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
