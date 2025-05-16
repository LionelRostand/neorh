
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
}

const NewLeaveRequestForm: React.FC<NewLeaveRequestFormProps> = ({ 
  open, 
  onClose, 
  onSuccess,
  employeeId
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
    },
  });

  // Mettre à jour l'employeeId si fourni en prop
  useEffect(() => {
    if (employeeId) {
      form.setValue("employeeId", employeeId);
    }
  }, [employeeId, form]);

  // Effet pour montrer/cacher le champ d'allocation selon le type
  useEffect(() => {
    // Vérifier si le type sélectionné nécessite une allocation
    const shouldShowAllocation = ["paid", "rtt"].includes(selectedType);
    setShowDaysAllocation(shouldShowAllocation);
    
    // Réinitialiser le nombre de jours si on ne montre plus le champ
    if (!shouldShowAllocation) {
      form.setValue("daysAllocated", 0);
    }
  }, [selectedType, form]);

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
    const typeObj = leaveTypes.find(t => t.id === selectedType);
    return `Nombre de jours de ${typeObj?.label || "congés"} à attribuer`;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle attribution de congé</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {!employeeId && <EmployeeField form={form} />}
            <LeaveTypeField form={form} onTypeChange={handleTypeChange} />
            
            {/* Champ d'allocation conditionnel */}
            {showDaysAllocation && (
              <DaysAllocationField 
                form={form} 
                label={getAllocationLabel()}
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
            <LeaveFormActions onCancel={onClose} isSubmitting={isSubmitting} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewLeaveRequestForm;
