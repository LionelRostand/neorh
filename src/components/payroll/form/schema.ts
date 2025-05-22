
import { z } from "zod";

// Schema for the payslip form
export const payslipFormSchema = z.object({
  employee: z.string().min(1, { message: "Veuillez sélectionner un employé" }),
  company: z.string().min(1, { message: "Veuillez sélectionner une entreprise" }),
  period: z.string().min(1, { message: "Veuillez sélectionner une période" }),
  annualSalary: z.string().optional(),
  overtimeHours: z.string().optional(),
  overtimeRate: z.string().default("25"),
});
