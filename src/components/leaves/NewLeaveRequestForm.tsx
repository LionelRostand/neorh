
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
import { LeaveTypeField, leaveTypes } from "./form/LeaveTypeField";
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
  const [showDaysAllocation, setShowDaysAllocation] = useState<boolean>(false);

  const form = useForm<LeaveFormValues>({
    defaultValues: {
      employeeId: employeeId || "",
      type: "",
      startDate: undefined,
      endDate: undefined,
      comment: "",
      daysAllocated: 0,
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
    
    // Pour les allocations, toujours montrer le champ d'allocation
    if (isAllocation) {
      setShowDaysAllocation(true);
    }
  }, [employeeId, form, isAllocation]);

  // Effet pour montrer/cacher le champ d'allocation selon le type
  useEffect(() => {
    // Si c'est une allocation, toujours montrer le champ d'allocation
    if (isAllocation) {
      setShowDaysAllocation(true);
      return;
    }
    
    // Pour les demandes normales, vérifier si le type nécessite une allocation
    const shouldShowAllocation = ["paid", "rtt"].includes(selectedType);
    setShowDaysAllocation(shouldShowAllocation);
    
    // Réinitialiser le nombre de jours si on ne montre plus le champ
    if (!shouldShowAllocation) {
      form.setValue("daysAllocated", 0);
    }
  }, [selectedType, form, isAllocation]);

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
  const getAllocationLabel = () => {
    if (isAllocation) {
      return "Nombre de jours à attribuer";
    }
    
    const typeObj = leaveTypes.find(t => t.id === selectedType);
    return `Nombre de jours de ${typeObj?.label || "congés"} à attribuer`;
  };
  
  // Déterminer le titre du formulaire
  const getDialogTitle = () => {
    return isAllocation ? "Nouvelle attribution de congés" : "Nouvelle demande de congé";
  };
  
  // Texte d'aide pour l'allocation
  const getAllocationHelperText = () => {
    if (isAllocation && selectedType === "paid") {
      return "Au-delà de 5 jours, les jours restants seront conservés pour la prochaine période";
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
              allowedTypes={isAllocation ? ["paid", "rtt"] : undefined}
            />
            
            {/* Champ d'allocation conditionnel */}
            {showDaysAllocation && (
              <DaysAllocationField 
                form={form} 
                label={getAllocationLabel()}
                helperText={getAllocationHelperText()}
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
              submitLabel={isAllocation ? "Attribuer la demande" : "Soumettre la demande"}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewLeaveRequestForm;
