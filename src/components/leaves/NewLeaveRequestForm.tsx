
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { LeaveFormValues } from "./form/types";
import { EmployeeField } from "./form/EmployeeField";
import { LeaveTypeField, defaultLeaveTypes } from "./form/LeaveTypeField";
import { DatePickerField } from "./form/DatePickerField";
import { CommentField } from "./form/CommentField";
import { LeaveFormActions } from "./form/LeaveFormActions";
import { useLeaveFormSubmit } from "./form/useLeaveFormSubmit";
import { DaysAllocationField } from "./form/DaysAllocationField";
import { useEffect, useState } from "react";

interface NewLeaveRequestFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  employeeId?: string;
  isAllocation?: boolean;
}

const NewLeaveRequestForm: React.FC<NewLeaveRequestFormProps> = ({ 
  open, 
  onClose, 
  onSuccess,
  employeeId,
  isAllocation = false
}) => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [showPaidLeaveAllocation, setShowPaidLeaveAllocation] = useState<boolean>(false);
  const [showRttAllocation, setShowRttAllocation] = useState<boolean>(false);

  const form = useForm<LeaveFormValues>({
    defaultValues: {
      employeeId: employeeId || "",
      type: "",
      startDate: undefined,
      endDate: undefined,
      comment: "",
      daysAllocated: 0,
      paidDaysAllocated: 0,
      rttDaysAllocated: 0,
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
    
    // Pour les allocations, toujours montrer les champs d'allocation selon le type sélectionné
    if (isAllocation) {
      setShowPaidLeaveAllocation(selectedType === "paid");
      setShowRttAllocation(selectedType === "rtt");
    }
  }, [employeeId, form, isAllocation, selectedType]);

  // Effet pour montrer/cacher les champs d'allocation selon le type
  useEffect(() => {
    // Si c'est une allocation, gérer les champs d'allocation selon le type
    if (isAllocation) {
      setShowPaidLeaveAllocation(selectedType === "paid");
      setShowRttAllocation(selectedType === "rtt");
      
      // Réinitialiser les valeurs non utilisées
      if (selectedType === "paid") {
        form.setValue("rttDaysAllocated", 0);
        form.setValue("daysAllocated", form.getValues("paidDaysAllocated"));
      } else if (selectedType === "rtt") {
        form.setValue("paidDaysAllocated", 0);
        form.setValue("daysAllocated", form.getValues("rttDaysAllocated"));
      } else {
        form.setValue("paidDaysAllocated", 0);
        form.setValue("rttDaysAllocated", 0);
        form.setValue("daysAllocated", 0);
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

  // Synchroniser le champ daysAllocated avec paidDaysAllocated ou rttDaysAllocated
  const syncDaysAllocated = (type: string, value: number) => {
    form.setValue("daysAllocated", value);
    if (type === "paid") {
      form.setValue("paidDaysAllocated", value);
    } else if (type === "rtt") {
      form.setValue("rttDaysAllocated", value);
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  const { handleSubmit, isSubmitting } = useLeaveFormSubmit(() => {
    form.reset();
    onClose();
    // Appeler onSuccess si fourni pour rafraîchir la liste des congés
    if (onSuccess) {
      onSuccess();
    }
  });

  // Générer le libellé du champ d'allocation en fonction du type
  const getPaidLeaveAllocationLabel = () => {
    return "Nombre de jours de Congé payé à attribuer";
  };
  
  const getRttAllocationLabel = () => {
    return "Nombre de jours de RTT à attribuer";
  };
  
  // Déterminer le titre du formulaire
  const getDialogTitle = () => {
    return isAllocation ? "Nouvelle attribution de congés" : "Nouvelle attribution de congé";
  };
  
  // Texte d'aide pour l'allocation
  const getPaidLeaveHelperText = () => {
    if (isAllocation && selectedType === "paid") {
      return "Au-delà de 5 jours, les jours restants seront conservés pour la prochaine période";
    }
    return undefined;
  };
  
  const getRttHelperText = () => {
    if (isAllocation && selectedType === "rtt") {
      return "Les jours de RTT doivent être utilisés dans la période courante";
    }
    return undefined;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {!employeeId && <EmployeeField form={form} />}
            <LeaveTypeField 
              form={form} 
              onTypeChange={handleTypeChange} 
              allowedTypes={isAllocation ? defaultLeaveTypes : undefined}
            />
            
            {/* Champ d'allocation pour congés payés */}
            {showPaidLeaveAllocation && (
              <DaysAllocationField 
                form={form} 
                name="paidDaysAllocated"
                label={getPaidLeaveAllocationLabel()}
                helperText={getPaidLeaveHelperText()}
                onChange={(value) => syncDaysAllocated("paid", value)}
              />
            )}
            
            {/* Champ d'allocation pour RTT */}
            {showRttAllocation && (
              <DaysAllocationField 
                form={form} 
                name="rttDaysAllocated"
                label={getRttAllocationLabel()}
                helperText={getRttHelperText()}
                onChange={(value) => syncDaysAllocated("rtt", value)}
              />
            )}
            
            <DatePickerField 
              form={form} 
              name="startDate" 
              label="Date de début" 
            />
            <DatePickerField 
              form={form} 
              name="endDate" 
              label="Date de fin"
              disableDates={(date) => {
                const startDate = form.getValues("startDate");
                return startDate ? date < startDate : false;
              }}
            />
            <CommentField form={form} />
            <LeaveFormActions 
              onCancel={onClose} 
              isSubmitting={isSubmitting} 
              submitLabel={isAllocation ? "Attribuer les congés" : "Soumettre la demande"}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewLeaveRequestForm;
