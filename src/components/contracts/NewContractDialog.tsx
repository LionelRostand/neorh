
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ContractForm from "./form/ContractForm";
import useFirestore from "@/hooks/useFirestore";
import { toast } from "@/components/ui/use-toast";
import { useEmployeeData } from "@/hooks/useEmployeeData";

interface NewContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function NewContractDialog({ 
  open, 
  onOpenChange,
  onSuccess
}: NewContractDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contractsCollection = useFirestore("hr_contracts");
  const { employees } = useEmployeeData();

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Trouver l'employé pour afficher son nom dans le contrat
      const employeeData = employees.find(emp => emp.id === data.employeeId);
      
      // Préparer les données du contrat
      const contractData = {
        ...data,
        employeeName: employeeData?.name || "Employé inconnu",
        startDate: data.startDate ? data.startDate.toISOString().split('T')[0] : "",
        endDate: data.endDate ? data.endDate.toISOString().split('T')[0] : "",
        status: "pending", // Par défaut, un nouveau contrat est en attente
        createdAt: new Date().toISOString(),
      };
      
      // Enregistrer dans Firestore
      await contractsCollection.add(contractData);
      
      // Notification de succès
      toast({
        title: "Contrat créé",
        description: "Le contrat a été créé avec succès",
      });
      
      // Fermer le dialogue et rafraîchir les données
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erreur lors de la création du contrat:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le contrat. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouveau contrat</DialogTitle>
        </DialogHeader>
        <ContractForm 
          onCancel={handleCancel} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
