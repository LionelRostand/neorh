
import { z } from "zod";

export const schema = z.object({
  employeeId: z.string({ required_error: "Veuillez sélectionner un employé" }),
  employeeName: z.string().optional(),
  departmentId: z.string({ required_error: "Veuillez sélectionner un département" }),
  position: z.string().min(1, { message: "Veuillez saisir un poste" }),
  type: z.string({ required_error: "Veuillez sélectionner un type de contrat" }),
  salary: z.string().regex(/^\d+$/, { message: "Le salaire doit être un nombre" }),
  startDate: z.string({ required_error: "Veuillez sélectionner une date de début" }),
  endDate: z.string().optional(),
  conventionCollective: z.string().optional(),
  additionalClauses: z.string().optional(),
  status: z.enum(["draft", "pending", "active", "expired", "pending_signature"], { 
    required_error: "Veuillez sélectionner un statut"
  }).default("pending_signature"),
});

export type ContractFormValues = z.infer<typeof schema>;
