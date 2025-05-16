
import { z } from "zod";

// Schéma de validation pour le formulaire
export const badgeFormSchema = z.object({
  number: z.string().min(1, "Le numéro de badge est requis"),
  employeeId: z.string().min(1, "L'employé est requis"),
  type: z.string().min(1, "Le niveau d'accès est requis"),
  issueDate: z.date({
    required_error: "La date de début de validité est requise",
  }),
  expiryDate: z.date().optional(),
  status: z.enum(["active", "inactive", "pending", "lost"], {
    required_error: "Le statut est requis",
  }),
  notes: z.string().optional(),
});

export type BadgeFormValues = z.infer<typeof badgeFormSchema>;

export const badgeTypes = [
  { value: "standard", label: "Employé" },
  { value: "admin", label: "Administration" },
  { value: "visitor", label: "Visiteur" },
  { value: "contractor", label: "Prestataire" },
];

export const badgeStatuses = [
  { value: "active", label: "Actif" },
  { value: "inactive", label: "Inactif" },
  { value: "pending", label: "En attente" },
  { value: "lost", label: "Perdu" },
];
