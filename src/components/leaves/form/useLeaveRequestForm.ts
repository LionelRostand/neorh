
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
  // Always show both allocation fields when it's an allocation form
  const [showPaidLeaveAllocation, setShowPaidLeaveAllocation] = useState<boolean>(isAllocation);
  const [showRttAllocation, setShowRttAllocation] = useState<boolean>(isAllocation);

  const form = useForm<LeaveFormValues>({
    defaultValues: {
      employeeId: employeeId || "",
      type: "",
      startDate: undefined,
      endDate: undefined,
      comment: "",
      daysAllocated: 0,
      paidDaysAllocated: 25, // Default value for France
      rttDaysAllocated: 12, // Default RTT value
      isAllocation: isAllocation
    },
  });

  // Mettre à jour l'employeeId si fourni en prop
  useEffect(() => {
    if (employeeId) {
      form.setValue("employeeId", employeeId);
    }
    
    // Set isAllocation flag
    form.setValue("isAllocation", isAllocation);
    
    // Pour les allocations, toujours montrer les champs d'allocation
    if (isAllocation) {
      setShowPaidLeaveAllocation(true);
      setShowRttAllocation(true);
    }
  }, [employeeId, form, isAllocation]);

  // Effet pour montrer/cacher les champs d'allocation selon le type
  useEffect(() => {
    // Si c'est une allocation, toujours afficher les deux champs
    if (isAllocation) {
      setShowPaidLeaveAllocation(true);
      setShowRttAllocation(true);
      
      // Update daysAllocated based on selected type
      if (selectedType === "paid") {
        form.setValue("daysAllocated", form.getValues("paidDaysAllocated"));
      } else if (selectedType === "rtt") {
        form.setValue("daysAllocated", form.getValues("rttDaysAllocated"));
      }
    } else {
      // Pour les demandes normales
      const shouldShowAllocation = ["paid", "rtt"].includes(selectedType);
      setShowPaidLeaveAllocation(false);
      setShowRttAllocation(false);
      
      // Réinitialiser le nombre de jours si on ne montre plus le champ
      if (!shouldShowAllocation) {
        form.setValue("daysAllocated", 0);
        form.setValue("paidDaysAllocated", 0);
        form.setValue("rttDaysAllocated", 0);
      }
    }
  }, [selectedType, form, isAllocation]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  // Synchroniser le champ daysAllocated avec paidDaysAllocated ou rttDaysAllocated
  const syncDaysAllocated = (type: string, value: number) => {
    if (type === "paid") {
      form.setValue("paidDaysAllocated", value);
      if (selectedType === "paid") {
        form.setValue("daysAllocated", value);
      }
    } else if (type === "rtt") {
      form.setValue("rttDaysAllocated", value);
      if (selectedType === "rtt") {
        form.setValue("daysAllocated", value);
      }
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
    return isAllocation ? "Nouvelle attribution de congés" : "Nouvelle demande de congé";
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
