
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, X, Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { toast } from "@/components/ui/use-toast";
import { useFirestore } from "@/hooks/useFirestore";
import { Training } from "@/hooks/useTrainingData";

const trainingSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  type: z.string().min(1, "Le type est requis"),
  organization: z.string().optional(),
  location: z.string().optional(),
  startDate: z.date({ required_error: "La date de début est requise" }),
  endDate: z.date().optional(),
  description: z.string().optional(),
  employees: z.array(z.string()).min(1, "Au moins un employé est requis"),
});

type TrainingFormValues = z.infer<typeof trainingSchema>;

interface NewTrainingFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

const trainingTypes = [
  { value: "technique", label: "Technique" },
  { value: "management", label: "Management" },
  { value: "communication", label: "Communication" },
  { value: "securite", label: "Sécurité" },
  { value: "informatique", label: "Informatique" },
  { value: "langue", label: "Langue" },
  { value: "autre", label: "Autre" },
];

const NewTrainingForm = ({ onCancel, onSuccess }: NewTrainingFormProps) => {
  const { employees } = useEmployeeData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { create } = useFirestore<Training>("hr_trainings");
  
  const form = useForm<TrainingFormValues>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      title: "",
      type: "",
      organization: "",
      location: "",
      description: "",
      employees: [],
    },
  });

  const selectedEmployeeIds = form.watch("employees") || [];

  const handleSubmit = async (values: TrainingFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Creating new training:", values);
      
      // For now, we'll create a separate training entry for each employee
      // This approach ensures backwards compatibility with the existing data structure
      for (const employeeId of values.employees) {
        const employeeName = employees.find(e => e.id === employeeId)?.name || "Unknown";
        
        await create({
          title: values.title,
          description: values.description || "",
          type: values.type,
          trainer: values.organization || "Interne",
          department: employees.find(e => e.id === employeeId)?.departmentId || "",
          location: values.location || "",
          status: "planifiée",
          startDate: values.startDate.toISOString(),
          endDate: values.endDate?.toISOString() || "",
          employeeId: employeeId,
          participants: values.employees.length,
          employeeName: employeeName,
        });
      }
      
      toast({
        title: "Formation créée",
        description: "La formation a été créée avec succès",
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating training:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la formation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeEmployee = (idToRemove: string) => {
    const updated = selectedEmployeeIds.filter(id => id !== idToRemove);
    form.setValue("employees", updated);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de la formation *</FormLabel>
              <FormControl>
                <Input placeholder="Titre de la formation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de formation *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {trainingTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employees"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Employé *</FormLabel>
                <div className="grid grid-cols-1">
                  <Select
                    onValueChange={(value) => {
                      const currentValues = field.value || [];
                      if (!currentValues.includes(value)) {
                        field.onChange([...currentValues, value]);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un employé" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedEmployeeIds.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedEmployeeIds.map((id) => {
                      const emp = employees.find((e) => e.id === id);
                      return (
                        <div
                          key={id}
                          className="bg-blue-50 text-blue-700 text-sm px-2 py-1 rounded-md flex items-center gap-1"
                        >
                          {emp?.name || id}
                          <button
                            type="button"
                            onClick={() => removeEmployee(id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organisme de formation</FormLabel>
                <FormControl>
                  <Input placeholder="Organisme de formation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lieu</FormLabel>
                <FormControl>
                  <Input placeholder="Lieu de la formation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de début *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy", { locale: fr })
                        ) : (
                          <span>jj/mm/aaaa</span>
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
                      locale={fr}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de fin</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy", { locale: fr })
                        ) : (
                          <span>jj/mm/aaaa</span>
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
                      locale={fr}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description de la formation"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Création en cours..." : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewTrainingForm;
