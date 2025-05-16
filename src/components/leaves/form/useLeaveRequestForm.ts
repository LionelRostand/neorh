
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { LeaveFormValues } from "./types";
import { useLeaveFormSubmit } from "./useLeaveFormSubmit";

export function useLeaveRequestForm(
  onClose: () => void,
  onSuccess?: () => void,
  employeeId?: string,
  isAllocation = false
) {
  const [selectedType, setSelectedType] = useState<string>("");
  // Toujours montrer les deux champs d'allocation
  const [showPaidLeaveAllocation, setShowPaidLeaveAllocation] = useState<boolean>(true);
  const [showRttAllocation, setShowRttAllocation] = useState<boolean>(true);

  const form = useForm<LeaveFormValues>({
    defaultValues: {
      employeeId: employeeId || "",
      type: "",
      startDate: undefined,
      endDate: undefined,
      comment: "",
      daysAllocated: 0,
      paidDaysAllocated: 25, // Valeur par défaut pour la France
      rttDaysAllocated: 12, // Valeur par défaut pour les RTT
      isAllocation: true // Toujours en mode allocation
    },
  });

  // Mettre à jour l'employeeId si fourni en prop
  useEffect(() => {
    if (employeeId) {
      form.setValue("employeeId", employeeId);
    }
    
    // Définir le flag isAllocation
    form.setValue("isAllocation", true);
    
    // Pour les allocations, toujours montrer les champs d'allocation
    setShowPaidLeaveAllocation(true);
    setShowRttAllocation(true);
  }, [employeeId, form, isAllocation]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  // Synchroniser le champ daysAllocated avec paidDaysAllocated ou rttDaysAllocated
  const syncDaysAllocated = (type: string, value: number) => {
    if (type === "paid") {
      form.setValue("paidDaysAllocated", value);
    } else if (type === "rtt") {
      form.setValue("rttDaysAllocated", value);
    }
  };

  const { handleSubmit, isSubmitting } = useLeaveFormSubmit(() => {
    form.reset();
    onClose();
    // Appeler onSuccess si fourni pour rafraîchir la liste des congés
    if (onSuccess) {
      onSuccess();
    }
  });

  // Déterminer le titre du formulaire
  const getDialogTitle = () => {
    return "Attribution de congés sur période";
  };
  
  // Texte d'aide pour l'allocation
  const getPaidLeaveHelperText = () => {
    return "Au-delà de 5 jours, les jours restants seront conservés pour la prochaine période";
  };
  
  const getRttHelperText = () => {
    return "Les jours de RTT doivent être utilisés dans la période courante";
  };

  // Générer le libellé du champ d'allocation en fonction du type
  const getPaidLeaveAllocationLabel = () => {
    return "Nombre de jours de Congé payé à attribuer";
  };
  
  const getRttAllocationLabel = () => {
    return "Nombre de jours de RTT à attribuer";
  };

  return {
    form,
    selectedType,
    handleTypeChange,
    syncDaysAllocated,
    handleFormSubmit: form.handleSubmit(handleSubmit),
    isSubmitting,
    showPaidLeaveAllocation,
    showRttAllocation,
    getPaidLeaveAllocationLabel,
    getRttAllocationLabel,
    getPaidLeaveHelperText,
    getRttHelperText,
    getDialogTitle
  };
}
