
import { z } from 'zod';

export const editEmployeeFormSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom complet doit contenir au moins 2 caractères",
  }),
  email: z.string().email({
    message: "Email invalide",
  }),
  phone: z.string().optional(),
  position: z.string().min(2, {
    message: "Le poste est requis",
  }),
  department: z.string().min(2, {
    message: "Le département est requis",
  }),
  status: z.enum(['active', 'inactive', 'onLeave'], {
    message: "Le statut doit être 'actif', 'inactif', ou 'en congé'",
  }),
  startDate: z.date({
    required_error: "La date d'embauche est requise",
  }),
  photoUrl: z.string().optional(),
  managerId: z.string().optional(),
});

export type EmployeeEditFormValues = z.infer<typeof editEmployeeFormSchema>;
