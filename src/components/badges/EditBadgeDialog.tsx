
import React, { useEffect } from "react";
import { format, parse } from "date-fns";
import { useFirestore } from "@/hooks/useFirestore";
import { Employee } from "@/types/employee";
import { Badge } from "@/types/firebase";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddBadgeForm } from "./form/AddBadgeForm";
import { BadgeFormValues } from "./form/FormSchema";

interface EditBadgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badge: Badge | null;
  employees: Employee[];
  onSuccess: () => void;
  isLoadingEmployees: boolean;
}

export function EditBadgeDialog({
  open,
  onOpenChange,
  badge,
  employees,
  onSuccess,
  isLoadingEmployees,
}: EditBadgeDialogProps) {
  const { update, isLoading } = useFirestore<Badge>("hr_badges");

  const handleSubmit = async (data: BadgeFormValues) => {
    if (!badge?.id) return;
    
    try {
      // Trouver l'employé sélectionné pour récupérer son nom
      const selectedEmployee = employees.find(
        (emp) => emp.id === data.employeeId
      );
      
      const employeeName = selectedEmployee ? selectedEmployee.name : "Employé inconnu";

      // Préparer l'objet badge à mettre à jour dans Firestore
      const updatedBadge: Partial<Badge> = {
        employeeId: data.employeeId,
        type: data.type,
        status: data.status as "active" | "inactive" | "lost" | "pending",
        issueDate: format(data.issueDate, "dd/MM/yyyy"),
        notes: data.notes || "",
        employeeName
      };
      
      // Ajouter la date d'expiration uniquement si elle est définie et valide
      if (data.expiryDate && data.expiryDate instanceof Date) {
        updatedBadge.expiryDate = format(data.expiryDate, "dd/MM/yyyy");
      }

      console.log("Badge à modifier:", updatedBadge);

      // Mettre à jour le document dans Firestore
      await update(badge.id, updatedBadge);
      toast({
        title: "Badge mis à jour",
        description: "Le badge a été mis à jour avec succès",
      });
      
      // Fermer le dialogue et rafraîchir les données
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la modification du badge:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du badge",
        variant: "destructive",
      });
    }
  };

  // Convertir les données du badge pour le formulaire
  const getFormValues = (): BadgeFormValues | null => {
    if (!badge) return null;

    // Convertir les dates de string (dd/MM/yyyy) à Date
    let issueDate;
    try {
      issueDate = parse(badge.issueDate, "dd/MM/yyyy", new Date());
    } catch (e) {
      issueDate = new Date();
    }

    let expiryDate = undefined;
    if (badge.expiryDate) {
      try {
        expiryDate = parse(badge.expiryDate, "dd/MM/yyyy", new Date());
      } catch (e) {
        // En cas d'erreur, on laisse undefined
      }
    }

    return {
      number: badge.number,
      employeeId: badge.employeeId,
      type: badge.type,
      status: badge.status,
      issueDate,
      expiryDate,
      notes: badge.notes || ""
    };
  };

  const formValues = getFormValues();

  if (!badge || !formValues) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le badge {badge.number}</DialogTitle>
          <DialogDescription>
            Modifiez les informations du badge
          </DialogDescription>
        </DialogHeader>
        <AddBadgeForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          employees={employees}
          isLoading={isLoading || isLoadingEmployees}
          generatedBadgeNumber={badge.number}
          defaultValues={formValues}
          isEditMode={true}
        />
      </DialogContent>
    </Dialog>
  );
}
