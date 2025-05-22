
import * as z from "zod";

// Schema for form validation
export const editContractSchema = z.object({
  employeeName: z.string().min(3, { message: "Le nom de l'employé est requis" }),
  position: z.string().min(1, { message: "Le poste est requis" }),
  type: z.string().min(1, { message: "Le type de contrat est requis" }),
  startDate: z.string().min(1, { message: "La date de début est requise" }),
  endDate: z.string().optional(),
  status: z.enum(["draft", "pending", "active", "expired", "pending_signature"], { 
    message: "Le statut doit être valide" 
  })
});

export type EditContractFormValues = z.infer<typeof editContractSchema>;
