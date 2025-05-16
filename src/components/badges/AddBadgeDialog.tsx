
import React from "react";
import { format } from "date-fns";
import { useFirestore } from "@/hooks/useFirestore";
import { Employee, Badge } from "@/types/firebase";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddBadgeForm } from "./AddBadgeForm";

interface AddBadgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  onSuccess: () => void;
  isLoadingEmployees: boolean;
}

export function AddBadgeDialog({
  open,
  onOpenChange,
  employees,
  onSuccess,
  isLoadingEmployees,
}: AddBadgeDialogProps) {
  // Utilisation du hook Firestore pour la collection hr_badges
  const { add, isLoading } = useFirestore<Badge>("hr_badges");

  const handleSubmit = async (data: any) => {
    try {
      // Trouver l'employé sélectionné pour récupérer son nom
      const selectedEmployee = employees.find(
        (emp) => emp.id === data.employeeId
      );
      
      const employeeName = selectedEmployee
        ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
        : "Employé inconnu";

      // Préparer l'objet badge à ajouter dans Firestore
      const badge: Partial<Badge> = {
        number: data.number,
        employeeId: data.employeeId,
        type: data.type,
        status: data.status as "active" | "inactive" | "lost" | "pending",
        issueDate: format(data.issueDate, "dd/MM/yyyy"),
        expiryDate: data.expiryDate ? format(data.expiryDate, "dd/MM/yyyy") : undefined,
        notes: data.notes,
        // Ajouter le nom de l'employé pour l'affichage dans la liste
        employeeName
      };

      // Ajouter le document à Firestore
      await add(badge as Badge);
      toast({
        title: "Badge créé",
        description: "Le badge a été créé avec succès",
      });
      
      // Fermer le dialogue et rafraîchir les données
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la création du badge:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du badge",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un nouveau badge</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un badge d'accès
          </DialogDescription>
        </DialogHeader>
        <AddBadgeForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          employees={employees}
          isLoading={isLoading || isLoadingEmployees}
        />
      </DialogContent>
    </Dialog>
  );
}
