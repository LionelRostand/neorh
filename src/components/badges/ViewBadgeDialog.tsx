
import React from "react";
import { Badge } from "@/types/firebase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

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

  const handlePrintBadge = () => {
    if (!badge) return;
    
    // Créer une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error("Impossible d'ouvrir une fenêtre d'impression");
      return;
    }

    // Contenu HTML pour l'impression du badge
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Badge ${badge.number}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
            }
            .badge-container {
              width: 85mm;
              height: 54mm;
              border: 1px solid #000;
              margin: 20px auto;
              padding: 10px;
              box-sizing: border-box;
              position: relative;
              display: flex;
              flex-direction: column;
            }
            .badge-header {
              text-align: center;
              border-bottom: 1px solid #ccc;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }
            .badge-number {
              position: absolute;
              top: 5px;
              right: 5px;
              font-size: 10px;
              color: #666;
            }
            .badge-content {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            .employee-name {
              font-size: 16px;
              font-weight: bold;
              text-align: center;
              margin-bottom: 5px;
            }
            .badge-type {
              font-size: 12px;
              text-align: center;
              margin-bottom: 5px;
              color: #666;
            }
            .badge-status {
              width: fit-content;
              padding: 3px 8px;
              border-radius: 12px;
              font-size: 10px;
              margin: 0 auto;
              color: white;
              text-align: center;
            }
            .badge-footer {
              margin-top: 10px;
              border-top: 1px solid #ccc;
              padding-top: 5px;
              font-size: 10px;
              text-align: center;
              color: #666;
            }

            /* Statut du badge */
            .status-active {
              background-color: #10b981;
            }
            .status-inactive {
              background-color: #6b7280;
            }
            .status-pending {
              background-color: #f59e0b;
            }
            .status-lost {
              background-color: #ef4444;
            }

            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .badge-container {
                margin: 0;
                border: none;
                width: 100%;
                height: auto;
              }
              .print-button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="badge-container">
            <div class="badge-number">N° ${badge.number}</div>
            <div class="badge-header">
              <h2>BADGE D'ACCÈS</h2>
            </div>
            <div class="badge-content">
              <div class="employee-name">${badge.employeeName}</div>
              <div class="badge-type">${badge.type.toUpperCase()}</div>
              <div class="badge-status status-${badge.status}">${
                badge.status === 'active' ? 'ACTIF' :
                badge.status === 'inactive' ? 'INACTIF' :
                badge.status === 'pending' ? 'EN ATTENTE' :
                badge.status === 'lost' ? 'PERDU' : 'INCONNU'
              }</div>
            </div>
            <div class="badge-footer">
              <div>Date d'émission: ${badge.issueDate}</div>
              <div>Date d'expiration: ${badge.expiryDate || "Non définie"}</div>
            </div>
          </div>
          <div class="print-button" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print(); setTimeout(function(){ window.close(); }, 500);">
              Imprimer le badge
            </button>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // Si aucun badge n'est sélectionné, ne rien afficher
  if (!badge) {
    console.log("ViewBadgeDialog: No badge selected");
    return null;
  }
  
  console.log("ViewBadgeDialog: Rendering dialog for badge", badge);

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
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={handlePrintBadge}
            className="w-full sm:w-auto"
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimer le badge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
