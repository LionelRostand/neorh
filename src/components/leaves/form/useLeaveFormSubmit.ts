
import { useState } from "react";
import { LeaveFormValues } from "./types";
import { useFirestore } from "@/hooks/useFirestore";
import { Leave } from "@/lib/constants";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export function useLeaveFormSubmit(onSuccess: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { add } = useFirestore<Leave>('hr_leaves');

  const handleSubmit = async (values: LeaveFormValues) => {
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

      // Use the Leave type from constants to ensure type compatibility
      const leaveData: Omit<Leave, 'id'> = {
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

      onSuccess();
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

  return {
    handleSubmit,
    isSubmitting
  };
}
