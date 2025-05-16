
import React from "react";
import { Badge } from "@/types/firebase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge as BadgeUI } from "@/components/ui/badge";

interface ViewBadgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badge: Badge | null;
}

export function ViewBadgeDialog({
  open,
  onOpenChange,
  badge,
}: ViewBadgeDialogProps) {
  // Fonction pour render le badge UI en fonction du statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <BadgeUI className="bg-green-500">Actif</BadgeUI>;
      case 'inactive':
        return <BadgeUI className="bg-gray-500">Inactif</BadgeUI>;
      case 'pending':
        return <BadgeUI className="bg-yellow-500">En attente</BadgeUI>;
      case 'lost':
        return <BadgeUI className="bg-red-500">Perdu</BadgeUI>;
      default:
        return <BadgeUI>Inconnu</BadgeUI>;
    }
  };

  if (!badge) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails du badge {badge.number}</DialogTitle>
          <DialogDescription>
            Informations complètes sur le badge
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Numéro</p>
              <p className="font-medium">{badge.number}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Employé</p>
              <p className="font-medium">{badge.employeeName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <p className="font-medium">{badge.type}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Statut</p>
              {getStatusBadge(badge.status)}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Date d'émission</p>
              <p className="font-medium">{badge.issueDate}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Date d'expiration</p>
              <p className="font-medium">{badge.expiryDate || "Non définie"}</p>
            </div>
          </div>
          {badge.notes && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="text-sm">{badge.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
