
import { z } from "zod";

export const schema = z.object({
  employeeId: z.string({ required_error: "Veuillez sélectionner un employé" }),
  employeeName: z.string().optional(),
  departmentId: z.string({ required_error: "Veuillez sélectionner un département" }),
  position: z.string().min(1, { message: "Veuillez saisir un poste" }),
  type: z.string({ required_error: "Veuillez sélectionner un type de contrat" }),
  salary: z.string().regex(/^\d+$/, { message: "Le salaire doit être un nombre" }),
  startDate: z.date({ required_error: "Veuillez sélectionner une date de début" }),
  endDate: z.date().optional(),
  conventionCollective: z.string().optional(),
});

export type ContractFormValues = z.infer<typeof schema>;
