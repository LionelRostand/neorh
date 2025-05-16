
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useFirestore } from "@/hooks/firestore";
import { toast } from "@/components/ui/use-toast";
import { LeaveAllocation } from "@/hooks/leaves";
import { EmployeeSelectProps } from "../../form/EmployeeField";

export interface AllocationFormValues extends EmployeeSelectProps {
  paidLeavesTotal: number;
  rttTotal: number;
  comment?: string;
}

export function useLeaveAllocationForm(employeeId?: string, onSuccess?: () => void, onClose?: () => void) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { add: addAllocation, update: updateAllocation, search } = 
    useFirestore<LeaveAllocation>("hr_leave_allocations");
  const [existingAllocation, setExistingAllocation] = useState<LeaveAllocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<AllocationFormValues>({
    defaultValues: {
      employeeId: employeeId || "",
      paidLeavesTotal: 25, // Default value in France
      rttTotal: 12, // Default RTT
      comment: "",
    },
  });

  // Fetch existing allocation if employeeId is provided
  useEffect(() => {
    const fetchExistingAllocation = async () => {
      if (!employeeId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const currentYear = new Date().getFullYear();
        const result = await search("employeeId", employeeId);
        
        const currentAllocation = result.docs?.find(doc => doc.year === currentYear);
        
        if (currentAllocation) {
          setExistingAllocation(currentAllocation);
          form.setValue("paidLeavesTotal", currentAllocation.paidLeavesTotal);
          form.setValue("rttTotal", currentAllocation.rttTotal);
        }
      } catch (err) {
        console.error("Error fetching allocation:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingAllocation();
  }, [employeeId, form, search]);

  // Update employeeId if provided in props
  useEffect(() => {
    if (employeeId) {
      form.setValue("employeeId", employeeId);
    }
  }, [employeeId, form]);

  const handleSubmit = async (data: AllocationFormValues) => {
    if (!data.employeeId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un employé",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const currentYear = new Date().getFullYear();
      const allocationData: Omit<LeaveAllocation, "id"> = {
        employeeId: data.employeeId,
        year: currentYear,
        paidLeavesTotal: data.paidLeavesTotal,
        paidLeavesUsed: existingAllocation?.paidLeavesUsed || 0,
        rttTotal: data.rttTotal,
        rttUsed: existingAllocation?.rttUsed || 0,
        updatedAt: new Date().toISOString(),
      };
      
      // Seulement ajouter updatedBy s'il est défini
      if (user?.uid) {
        allocationData.updatedBy = user.uid;
      }

      if (existingAllocation?.id) {
        // Update existing allocation
        await updateAllocation(existingAllocation.id, allocationData);
        toast({
          title: "Succès",
          description: "L'attribution de congés a été mise à jour",
        });
      } else {
        // Create new allocation
        await addAllocation(allocationData);
        toast({
          title: "Succès",
          description: "Nouvelle attribution de congés créée",
        });
      }

      form.reset();
      if (onClose) {
        onClose();
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error saving allocation:", err);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'attribution de congés",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    isLoading,
    handleSubmit,
    existingAllocation
  };
}
