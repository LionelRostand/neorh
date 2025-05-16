
import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useFirestore } from "@/hooks/useFirestore";
import { toast } from "@/components/ui/use-toast";

interface NewLeaveRequestFormProps {
  open: boolean;
  onClose: () => void;
}

// Types de congés selon le droit du travail français
const leaveTypes = [
  { id: "paid", label: "Congé payé" },
  { id: "rtt", label: "RTT" },
  { id: "sick", label: "Congé Maladie" },
  { id: "family", label: "Congé Familial" },
  { id: "maternity", label: "Congé Maternité" },
  { id: "paternity", label: "Congé Paternité" },
];

interface LeaveFormValues {
  employeeId: string;
  type: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  comment: string;
}

const NewLeaveRequestForm: React.FC<NewLeaveRequestFormProps> = ({ open, onClose }) => {
  const form = useForm<LeaveFormValues>({
    defaultValues: {
      employeeId: "",
      type: "",
      startDate: undefined,
      endDate: undefined,
      comment: "",
    },
  });

  const { employees, isLoading: loadingEmployees } = useEmployeeData();
  const { add } = useFirestore<'hr_leaves'>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: LeaveFormValues) => {
    if (!values.startDate || !values.endDate || !values.employeeId || !values.type) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Formatage des dates pour Firestore
      const formattedStartDate = format(values.startDate, "yyyy-MM-dd");
      const formattedEndDate = format(values.endDate, "yyyy-MM-dd");

      const leaveData = {
        employeeId: values.employeeId,
        type: values.type,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        status: "pending",
        comment: values.comment || "",
        createdAt: new Date().toISOString(),
      };

      await add(leaveData);

      toast({
        title: "Succès",
        description: "Demande de congé créée avec succès",
      });

      // Réinitialiser le formulaire et fermer la boîte de dialogue
      form.reset();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création de la demande de congé:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la demande de congé",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle demande de congé</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employé</FormLabel>
                  <Select
                    disabled={loadingEmployees}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un employé" />
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de congé</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type de congé" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {leaveTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date de début</FormLabel>
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
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
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
                            "w-full pl-3 text-left font-normal",
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
                        disabled={(date) => {
                          const startDate = form.getValues("startDate");
                          return startDate ? date < startDate : false;
                        }}
                        locale={fr}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motif (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Entrez votre motif ici..."
                      {...field}
                      className="resize-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="sm:justify-end">
              <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="bg-emerald-500 hover:bg-emerald-600"
                disabled={isSubmitting}
              >
                Créer la demande
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewLeaveRequestForm;
