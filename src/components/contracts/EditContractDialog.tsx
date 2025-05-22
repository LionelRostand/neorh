
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import useFirestore from "@/hooks/useFirestore";
import { Contract } from "@/lib/constants";
import EditContractForm from "./form/EditContractForm";
import { EditContractFormValues } from "./form/editSchema";

interface EditContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: Contract | null;
  onSuccess: () => void;
}

export default function EditContractDialog({
  open,
  onOpenChange,
  contract,
  onSuccess
}: EditContractDialogProps) {
  const firestore = useFirestore<Contract>('hr_contracts');
  
  // Handle form submission
  const handleSubmit = async (data: EditContractFormValues) => {
    if (!contract?.id) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le contrat: ID manquant"
      });
      return;
    }

    try {
      // Format the data for Firestore
      const updatedContract: Partial<Contract> = {
        ...data,
        startDate: data.startDate,
        endDate: data.endDate || null
      };

      // Update contract in Firestore
      await firestore.update(contract.id, updatedContract);
      
      toast({
        title: "Succès",
        description: "Le contrat a été mis à jour avec succès"
      });
      
      onOpenChange(false);
      onSuccess(); // Refresh contracts list
    } catch (error) {
      console.error("Erreur lors de la mise à jour du contrat:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le contrat"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le contrat</DialogTitle>
        </DialogHeader>

        <EditContractForm 
          contract={contract} 
          onSubmit={handleSubmit} 
          onCancel={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}
