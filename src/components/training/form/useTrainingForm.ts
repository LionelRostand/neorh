
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFirestore } from "@/hooks/useFirestore";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { toast } from "@/components/ui/use-toast";
import { Training } from "@/hooks/useTrainingData";
import { TrainingFormValues, trainingSchema } from "./trainingSchema";

export const useTrainingForm = (onSuccess?: () => void, onCancel?: () => void) => {
  const { employees } = useEmployeeData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { add } = useFirestore<Training>("hr_trainings");
  
  const form = useForm<TrainingFormValues>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      title: "",
      type: "",
      organization: "",
      location: "",
      description: "",
      employees: [],
      status: "planifiée",
    },
  });

  const selectedEmployeeIds = form.watch("employees") || [];

  const handleSubmit = async (values: TrainingFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Creating new training:", values);
      
      // Create a separate training entry for each employee
      for (const employeeId of values.employees) {
        const employeeName = employees.find(e => e.id === employeeId)?.name || "Unknown";
        
        await add({
          title: values.title,
          description: values.description || "",
          type: values.type,
          organization: values.organization || "Interne",
          location: values.location || "",
          status: "planifiée",
          startDate: values.startDate.toISOString(),
          endDate: values.endDate?.toISOString() || "",
          employeeId: employeeId,
          participants: values.employees.length,
          employeeName: employeeName,
          trainer: values.organization || "Interne",
          department: employees.find(e => e.id === employeeId)?.departmentId || "",
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

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting,
    selectedEmployeeIds,
    removeEmployee,
    employees
  };
};
