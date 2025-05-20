
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ContractForm from "./form/ContractForm";
import useFirestore from "@/hooks/useFirestore";
import { toast } from "@/components/ui/use-toast";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useDepartmentsData } from "@/hooks/useDepartmentsData";
import { useCompaniesData } from "@/hooks/useCompaniesData";
import { generateContractPdf } from "@/utils/pdf/generateContractPdf";

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
  const { departments } = useDepartmentsData();
  const { companies } = useCompaniesData();

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Trouver l'employé pour afficher son nom dans le contrat
      const employeeData = employees.find(emp => emp.id === data.employeeId);
      
      // Trouver le département pour le contrat
      const departmentData = departments.find(dep => dep.id === data.departmentId);
      
      // Obtenir les données de l'entreprise pour l'en-tête du PDF
      const company = companies.length > 0 ? companies[0] : undefined;
      
      // Préparer les données du contrat
      const contractData = {
        ...data,
        employeeName: employeeData?.name || "Employé inconnu",
        departmentName: departmentData?.name || "Département non spécifié",
        startDate: data.startDate ? data.startDate.toISOString().split('T')[0] : "",
        endDate: data.endDate ? data.endDate.toISOString().split('T')[0] : "",
        status: "pending", // Par défaut, un nouveau contrat est en attente
        createdAt: new Date().toISOString(),
      };
      
      // Enregistrer dans Firestore
      await contractsCollection.add(contractData);
      
      // Générer le PDF du contrat
      generateContractPdf({
        employeeId: data.employeeId,
        employeeName: contractData.employeeName,
        position: data.position,
        type: data.type,
        salary: data.salary,
        startDate: data.startDate,
        endDate: data.endDate,
        departmentId: data.departmentId,
        departmentName: departmentData?.name
      }, company);
      
      // Notification de succès
      toast({
        title: "Contrat créé",
        description: "Le contrat a été créé avec succès et le PDF a été généré",
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
