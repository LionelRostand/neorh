
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useFirestore } from "@/hooks/firestore";
import { toast } from "@/components/ui/use-toast";
import { LeaveAllocation } from "@/hooks/leaves";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmployeeField } from "../form/EmployeeField";
import { Plus, Minus } from "lucide-react";

interface LeaveAllocationFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  employeeId?: string;
}

interface AllocationFormValues {
  employeeId: string;
  paidLeavesTotal: number;
  rttTotal: number;
  comment?: string;
}

const LeaveAllocationForm: React.FC<LeaveAllocationFormProps> = ({
  open,
  onClose,
  onSuccess,
  employeeId,
}) => {
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
        updatedBy: user?.uid,
      };

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
      onClose();
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

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle attribution de congé</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {!employeeId && <EmployeeField form={form} />}
            
            <FormField
              control={form.control}
              name="paidLeavesTotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Congés payés (jours)</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => form.setValue("paidLeavesTotal", Math.max(0, field.value - 1))}
                      className="h-8 w-8"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(Math.max(0, parseInt(e.target.value) || 0))}
                        className="h-9 text-center w-16"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => form.setValue("paidLeavesTotal", field.value + 1)}
                      className="h-8 w-8"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm text-gray-500">jours</span>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rttTotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RTT (jours)</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => form.setValue("rttTotal", Math.max(0, field.value - 1))}
                      className="h-8 w-8"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(Math.max(0, parseInt(e.target.value) || 0))}
                        className="h-9 text-center w-16"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => form.setValue("rttTotal", field.value + 1)}
                      className="h-8 w-8"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm text-gray-500">jours</span>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveAllocationForm;
